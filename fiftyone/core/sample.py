"""
Dataset samples.

| Copyright 2017-2020, Voxel51, Inc.
| `voxel51.com <https://voxel51.com/>`_
|
"""
from collections import defaultdict
from copy import deepcopy
import os
import six
import weakref

import eta.core.serial as etas
import eta.core.utils as etau
import eta.core.video as etav

from fiftyone.core.document import Document
import fiftyone.core.fields as fof
import fiftyone.core.frame as fofr
import fiftyone.core.frame_utils as fofu
import fiftyone.core.metadata as fom
import fiftyone.core.media as fomm
import fiftyone.core.odm as foo


class _DatasetSample(Document):
    def __getattr__(self, name):
        if name == "frames" and self.media_type == fomm.VIDEO:
            return self._frames._serve(self)

        return super().__getattr__(name)

    def __setattr__(self, name, value):
        if name == "frames" and self.media_type == fomm.VIDEO:
            self.set_field("frames", value)
            return

        super().__setattr__(name, value)

    def __getitem__(self, field_name):
        if fofu.is_frame_number(field_name) and self.media_type == fomm.VIDEO:
            return self.frames[field_name]

        try:
            return self.get_field(field_name)
        except AttributeError:
            raise KeyError(
                "%s has no field '%s'" % (self.__class__.__name__, field_name)
            )

    def __setitem__(self, field_name, value):
        if fofu.is_frame_number(field_name) and self.media_type == fomm.VIDEO:
            self.frames[field_name] = value
            return

        self._secure_media(field_name, value)
        self.set_field(field_name, value)

    @property
    def filename(self):
        """The basename of the media's filepath."""
        return os.path.basename(self.filepath)

    @property
    def media_type(self):
        """The media type of the sample."""
        return self._media_type

    @property
    def _skip_iter_field_names(self):
        if self.media_type == fomm.VIDEO:
            return ("frames",)

        return tuple()

    def get_field(self, field_name):
        if field_name == "frames" and self.media_type == fomm.VIDEO:
            return self._frames._serve(self)

        return super().get_field(field_name)

    def set_field(self, field_name, value, create=True):
        if field_name == "frames" and self.media_type == fomm.VIDEO:
            self.frames.clear()
            self.frames.update(value)
            return

        super().set_field(field_name, value, create=create)

    def clear_field(self, field_name):
        if field_name == "frames" and self.media_type == fomm.VIDEO:
            self.frames.clear()
            return

        super().clear_field(field_name)

    def compute_metadata(self):
        """Populates the ``metadata`` field of the sample."""
        if self.media_type == fomm.IMAGE:
            self.metadata = fom.ImageMetadata.build_for(self.filepath)
        elif self.media_type == fomm.VIDEO:
            self.metadata = fom.VideoMetadata.build_for(self.filepath)
        else:
            self.metadata = fom.Metadata.build_for(self.filepath)

        self.save()

    def merge(self, sample, overwrite=True):
        """Merges the fields of the sample into this sample.

        ``None``-valued fields are always omitted.

        Args:
            sample: a :class:`fiftyone.core.sample.Sample`
            overwrite (True): whether to overwrite existing fields. Note that
                existing fields whose values are ``None`` are always
                overwritten
        """
        if sample.media_type != self.media_type:
            raise ValueError(
                "Cannot merge sample with media type '%s' into sample with "
                "media type '%s'" % (sample.media_type, self.media_type)
            )

        super().merge(sample, overwrite=overwrite)

        if self.media_type == fomm.VIDEO:
            self.frames.merge(sample.frames, overwrite=overwrite)

    def copy(self):
        """Returns a deep copy of the sample that has not been added to the
        database.

        Returns:
            a :class:`Sample`
        """
        kwargs = {k: deepcopy(v) for k, v in self.iter_fields()}
        sample = Sample(**kwargs)

        if self.media_type == fomm.VIDEO:
            sample.frames.update({k: v.copy() for k, v in self.frames.items()})

        return sample

    def to_dict(self, include_frames=False):
        """Serializes the sample to a JSON dictionary.

        Sample IDs and private fields are excluded in this representation.

        Args:
            include_frames (False): whether to include the frame labels for
                video samples

        Returns:
            a JSON dict
        """
        d = super().to_dict()

        if self.media_type == fomm.VIDEO:
            if include_frames:
                d["frames"] = self.frames._to_frames_dict()
            else:
                d.pop("frames", None)

        return d

    def to_mongo_dict(self):
        """Serializes the sample to a BSON dictionary equivalent to the
        representation that would be stored in the database.

        Returns:
            a BSON dict
        """
        d = super().to_mongo_dict()
        if self.media_type == fomm.VIDEO:
            first_frame = self.frames._get_first_frame()
            if first_frame is not None:
                d["frames"]["first_frame"] = first_frame

        return d

    def _secure_media(self, field_name, value):
        if field_name == "filepath":
            value = os.path.abspath(os.path.expanduser(value))
            # pylint: disable=no-member
            new_media_type = fomm.get_media_type(value)
            if self.media_type != new_media_type:
                raise fomm.MediaTypeError(
                    "A sample's 'filepath' can be changed, but its media type "
                    "cannot; current '%s', new '%s'"
                    % (self.media_type, new_media_type)
                )


class Sample(_DatasetSample):
    """A sample in a :class:`fiftyone.core.dataset.Dataset`.

    Samples store all information associated with a particular piece of data in
    a dataset, including basic metadata about the data, one or more sets of
    labels (ground truth, user-provided, or FiftyOne-generated), and additional
    features associated with subsets of the data and/or label sets.

    Args:
        filepath: the path to the data on disk. The path is converted to an
            absolute path (if necessary) via
            ``os.path.abspath(os.path.expanduser(filepath))``
        tags (None): a list of tags for the sample
        metadata (None): a :class:`fiftyone.core.metadata.Metadata` instance
        **kwargs: additional fields to dynamically set on the sample
    """

    # Instance references keyed by [collection_name][sample_id]
    _instances = defaultdict(weakref.WeakValueDictionary)

    def __init__(self, filepath, tags=None, metadata=None, **kwargs):
        self._doc = foo.NoDatasetSampleDocument(
            filepath=filepath, tags=tags, metadata=metadata, **kwargs
        )
        if self.media_type == fomm.VIDEO:
            self._frames = fofr.Frames()

        super().__init__()

    def __str__(self):
        return repr(self)

    def __repr__(self):
        kwargs = {}
        if self.media_type == fomm.VIDEO:
            kwargs["frames"] = self._frames._serve(self).__repr__()

        return self._doc.fancy_repr(
            class_name=self.__class__.__name__, **kwargs
        )

    def __iter__(self):
        if self.media_type == fomm.VIDEO:
            return self._frames._serve(self).__iter__()

        raise StopIteration

    def save(self):
        """Saves the sample to the database."""
        if self.media_type == fomm.VIDEO and self._in_db:
            self.frames._save()

        super().save()

    @classmethod
    def from_frame(cls, frame, filepath):
        """Creates an image :class:`Sample` from the given
        :class:`fiftyone.core.frame.Frame`.

        Args:
            frame: a :class:`fiftyone.core.frame.Frame`
            filepath: the path to the corresponding image frame on disk

        Returns:
            a :class:`Sample`
        """
        return cls(filepath=filepath, **{k: v for k, v in frame.iter_fields()})

    @classmethod
    def from_doc(cls, doc, dataset=None):
        """Creates a :class:`Sample` backed by the given document.

        Args:
            doc: a :class:`fiftyone.core.odm.SampleDocument`
            dataset (None): the :class:`fiftyone.core.dataset.Dataset` that
                the sample belongs to

        Returns:
            a :class:`Sample`
        """
        if isinstance(doc, foo.NoDatasetSampleDocument):
            sample = cls.__new__(cls)
            sample._dataset = None
            sample._doc = doc
            return sample

        if not doc.id:
            raise ValueError("`doc` is not saved to the database.")

        try:
            # Get instance if exists
            sample = cls._instances[doc.collection_name][str(doc.id)]
        except KeyError:
            sample = cls.__new__(cls)
            sample._doc = None  # set to prevent RecursionError
            if dataset is None:
                raise ValueError(
                    "`dataset` arg must be provided for samples in datasets"
                )

            sample._set_backing_doc(doc, dataset=dataset)

        if sample.media_type == fomm.VIDEO:
            sample._frames = fofr.Frames()

        return sample

    @classmethod
    def from_dict(cls, d):
        """Loads the sample from a JSON dictionary.

        The returned sample will not belong to a dataset.

        Returns:
            a :class:`Sample`
        """
        doc = foo.NoDatasetSampleDocument.from_dict(d, extended=True)
        return cls.from_doc(doc)

    @classmethod
    def from_json(cls, s):
        """Loads the sample from a JSON string.

        Args:
            s: the JSON string

        Returns:
            a :class:`Sample`
        """
        doc = foo.NoDatasetSampleDocument.from_json(s)
        return cls.from_doc(doc)

    @classmethod
    def _reload_dataset_sample(cls, collection_name, sample_id):
        """Reloads the fields for the in-memory sample instance that belong to
        the specified collection.

        If the sample does not exist in-memory, nothing is done.

        Args:
            collection_name: the name of the MongoDB collection
            sample_id: the sample ID

        Returns:
            True/False whether the sample was reloaded
        """
        dataset_instances = cls._instances[collection_name]
        sample = dataset_instances.get(sample_id, None)
        if sample:
            sample.reload()
            return True

        return False

    @classmethod
    def _reload_dataset_samples(cls, collection_name):
        """Reloads the fields for in-memory sample instances that belong to the
        specified collection.

        Args:
            collection_name: the name of the MongoDB collection
        """
        for sample in cls._instances[collection_name].values():
            sample.reload()

    def _set_backing_doc(self, doc, dataset=None):
        if isinstance(self._doc, foo.DatasetSampleDocument):
            raise TypeError("Sample already belongs to a dataset")

        if not isinstance(doc, foo.DatasetSampleDocument):
            raise TypeError(
                "Backing doc must be an instance of %s; found %s"
                % (foo.DatasetSampleDocument, type(doc))
            )

        super()._set_backing_doc(doc, dataset=dataset)


class SampleView(_DatasetSample):
    """A view of a sample returned by a:class:`fiftyone.core.view.DatasetView`.

    SampleViews should never be created manually, only returned by dataset
    views. Sample views differ from samples similar to how dataset views differ
    from datasets:

    -   A sample view only exposes a subset of all data for a sample
    -   If a user attempts to modify an excluded field an error is raised
    -   If a user attempts to modify a filtered field (the field itself, not
        its elements) behavior is not guaranteed

    Args:
        doc: a :class:`fiftyone.core.odm.DatasetSampleDocument`
        dataset: the :class:`fiftyone.core.dataset.Dataset` that the sample
            belongs to
        selected_fields (None): a set of field names that this sample view is
            restricted to
        excluded_fields (None): a set of field names that are excluded from
            this sample view
        filtered_fields (None): a set of field names of list fields that are
            filtered in this view and thus need special handling when saving
    """

    def __init__(
        self,
        doc,
        dataset,
        selected_fields=None,
        excluded_fields=None,
        filtered_fields=None,
    ):
        if not isinstance(doc, foo.DatasetSampleDocument):
            raise TypeError(
                "Backing doc must be an instance of %s; found %s"
                % (foo.DatasetSampleDocument, type(doc))
            )

        if not doc.id:
            raise ValueError("`doc` is not saved to the database.")

        if selected_fields is not None and excluded_fields is not None:
            selected_fields = selected_fields.difference(excluded_fields)
            excluded_fields = None

        self._doc = doc
        self._selected_fields = selected_fields
        self._excluded_fields = excluded_fields
        self._filtered_fields = filtered_fields

        if self.media_type == fomm.VIDEO:
            self._frames = fofr.Frames()
            self._frames._serve(self)

        super().__init__(dataset=dataset)

    def __str__(self):
        return repr(self)

    def __repr__(self):
        kwargs = {}
        if self.media_type == fomm.VIDEO:
            kwargs["frames"] = self._frames._serve(self).__repr__()

        if self._selected_fields is not None:
            select_fields = ("id", "media_type") + tuple(self._selected_fields)
        else:
            select_fields = None

        return self._doc.fancy_repr(
            class_name=self.__class__.__name__,
            select_fields=select_fields,
            exclude_fields=self._excluded_fields,
            **kwargs,
        )

    def __getattr__(self, name):
        if not name.startswith("_") and name != "frames":
            if (
                self._selected_fields is not None
                and name not in self._selected_fields
            ):
                raise AttributeError(
                    "Field '%s' is not selected from this %s"
                    % (name, type(self).__name__)
                )

            if (
                self._excluded_fields is not None
                and name in self._excluded_fields
            ):
                raise AttributeError(
                    "Field '%s' is excluded from this %s"
                    % (name, type(self).__name__)
                )

        return super().__getattr__(name)

    @property
    def field_names(self):
        """An ordered tuple of field names of this sample.

        This may be a subset of all fields of the dataset if fields have been
        selected or excluded.
        """
        field_names = self._doc.field_names

        if self._selected_fields is not None:
            field_names = tuple(
                fn for fn in field_names if fn in self._selected_fields
            )

        if self._excluded_fields is not None:
            field_names = tuple(
                fn for fn in field_names if fn not in self._excluded_fields
            )

        return field_names

    @property
    def selected_field_names(self):
        """The set of field names that were selected on this sample, or
        ``None`` if no fields were explicitly selected.
        """
        return self._selected_fields

    @property
    def excluded_field_names(self):
        """The set of field names that were excluded on this sample, or
        ``None`` if no fields were explicitly excluded.
        """
        return self._excluded_fields

    def to_dict(self):
        """Serializes the sample to a JSON dictionary.

        Sample IDs and private fields are excluded in this representation.

        Returns:
            a JSON dict
        """
        d = super().to_dict()

        if self.selected_field_names or self.excluded_field_names:
            d = {k: v for k, v in d.items() if k in self.field_names}

        return d

    def save(self):
        """Saves the sample to the database.

        Any modified fields are updated, and any in-memory :class:`Sample`
        instances of this sample are updated.
        """
        if self.media_type == fomm.VIDEO and self._in_db:
            try:
                self.frames._save()
            except AttributeError:
                # frames is not selected, so we don't need to save it
                pass

        self._doc.save(filtered_fields=self._filtered_fields)

        # Reload the sample singleton if it exists in memory
        Sample._reload_dataset_sample(
            self.dataset._sample_collection_name, self.id
        )
