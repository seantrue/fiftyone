FiftyOne Release Notes
======================

.. default-role:: code

FiftyOne 0.6.5
--------------
*Released November 16, 2020*

App
^^^
- Added concurrency to the server wich greatly improves loading speeds and
  time-to-interaction in the Grid, View Bar, and Fields Sidebar for larger
  datasets and views
- Renamed the Display Options Sidebar to the Fields Sidebar
- Added support for coloring by `label` value in the Fields Sidebar
- Added support for filtering
  :class:`keypoint <fiftyone.core.labels.Keypoint>`,
  :class:`keypoints <fiftyone.core.labels.Keypoints>`,
  :class:`polyline <fiftyone.core.labels.Polyline>`,
  :class:`polylines <fiftyone.core.labels.Polylines>` fields by `label` value
  in the Fields Sidebar
- Moved plot tabs into an expandable window that can be resized and maximized.
  This allows for viewing distributions and the sample grid at the same time
- Fixed video loading in the grid and modal for video samples with metadata
- Fixed showing and hiding samples in the select sample menu
- Fixed a memory usage bug in the sample grid

Core
^^^^
- Added `Cityscapes <https://www.cityscapes-dataset.com/>`_ and
  `LFW <http://vis-www.cs.umass.edu/lfw>`_ to the
  :ref:`Dataset Zoo <dataset-zoo>`
- Added support for renaming and deleting embedded document fields of samples
  via :meth:`Dataset.rename_sample_field() <fiftyone.core.dataset.Dataset.rename_sample_field>` and
  :meth:`Dataset.delete_sample_field() <fiftyone.core.dataset.Dataset.delete_sample_field>`
- Added support for renaming and deleting embedded document fields of frames
  of video samples via :meth:`Dataset.rename_frame_field() <fiftyone.core.dataset.Dataset.rename_frame_field>` and
  :meth:`Dataset.delete_frame_field() <fiftyone.core.dataset.Dataset.delete_frame_field>`
- Added support for deleting fields and embedded fields of individual samples
  via :meth:`Sample.clear_field() <fiftyone.core.sample.Sample.clear_field>`
  and :meth:`del sample[field_name] <fiftyone.core.sample.Sample.__delitem__>`
- Added support for deleting fields and embedded fields of frame labels via
  :meth:`Frame.clear_field() <fiftyone.core.frame.Frame.clear_field>`
  and :meth:`del frame[field_name] <fiftyone.core.frame.Frame.__delitem__>`
- Added support for reading/writing video datasets in JSON format via
  :meth:`Dataset.from_json() <fiftyone.core.dataset.Dataset.from_json>` and
  :meth:`SampleCollection.write_json() <fiftyone.core.collections.SampleCollection.write_json>`,
  respectively
- Fixed a bug that prevented
  :meth:`Dataset.add_sample() <fiftyone.core.dataset.Dataset.add_sample>` and
  :meth:`Dataset.add_samples() <fiftyone.core.dataset.Dataset.add_samples>`
  from working properly when provided samples that belong to other sample
  collections
- Fixed a bug that prevented frame labels from being properly cloned when
  calling :meth:`Dataset.clone() <fiftyone.core.dataset.Dataset.clone>` on
  video datasets

Utils
^^^^^
- Added :mod:`a module <fiftyone.utils.scale>` for importing and exporting
  annotations from `Scale AI <https://scale.com>`_
- Added :mod:`a module <fiftyone.utils.labelbox>` for importing and exporting
  annotations from `Labelbox <https://labelbox.com>`_

Docs
^^^^
- Added an :doc:`Environments </environments>` page which outlines how
  to work with local, remote, and cloud data. Includes instructions for AWS,
  Azure, Google Cloud.
- Add an :doc:`FAQ </faq>` page

FiftyOne 0.6.4
--------------
*Released October 29, 2020*

App
^^^
- Improved page load times for video datasets
- Improved support for frame- and sample-level labels in display options for
  video datasets
- Added support for all label types in the labels distributions tab
- Added support for selecting and hiding objects in the sample modal

Core
^^^^
- Added the
  :meth:`filter_labels() <fiftyone.core.collections.SampleCollection.filter_labels>`
  view stage that is equivalent to using any
  classifications/detections/keypoints/polylines filter
- Added
  :meth:`select_objects() <fiftyone.core.collections.SampleCollection.select_objects>`
  and
  :meth:`exclude_objects() <fiftyone.core.collections.SampleCollection.exclude_objects>`
  to select or exclude objects from a dataset or view
- Added an :mod:`aggregations framework <fiftyone.core.aggregations>` for
  computing aggregate values via
  :meth:`aggregate() <fiftyone.core.collections.SampleCollection.aggregate>`
- Added the
  :attr:`selected_objects <fiftyone.core.session.Session.selected_objects>`
  session attribute, which holds the currently selected objects in the App
- Added support for
  :meth:`adding <fiftyone.core.dataset.Dataset.add_frame_field>`,
  :meth:`renaming <fiftyone.core.dataset.Dataset.rename_frame_field>`, and
  :meth:`deleting <fiftyone.core.dataset.Dataset.delete_frame_field>`
  frame-level fields of video datasets

Utils
^^^^^
- Added the
  :class:`TorchImagePatchesDataset <fiftyone.utils.torch.TorchImagePatchesDataset>`
  that emits tensors of patches extracted from images defined by sets of
  :class:`Detections <fiftyone.core.labels.Detections>` associated with the
  images

Brain
^^^^^
- Added support for computing uniqueness within regions-of-interest specified
  by a set of detections/polylines when using
  :meth:`compute_uniqueness() <fiftyone.brain.compute_uniqueness>`

FiftyOne 0.6.3
--------------
*Released October 20, 2020*

App
^^^
- Added sample-level display options stats, filtering, and toggling for video
  datasets

Core
^^^^
- Added support for :ref:`importing <VideoClassificationDirectoryTree-import>`
  and :ref:`exporting <VideoClassificationDirectoryTree-export>` video
  classification datasets organized as directory trees on disk
- Added `BDD100K <https://bdd-data.berkeley.edu>`_,
  `HMDB51 <https://serre-lab.clps.brown.edu/resource/hmdb-a-large-human-motion-database>`_,
  and `UCF101 <https://www.crcv.ucf.edu/research/data-sets/ucf101>`_ to
  the :ref:`Dataset Zoo <dataset-zoo>`
- Added new versions of `COCO <https://cocodataset.org/#home>`_ that contain
  instance segmentations to the :ref:`Dataset Zoo <dataset-zoo>`
- Added utilities for selecting objects from datasets via the Python library
- Added a boolean `only_matches` parameter to all filter stages that enables
  the user to specify that a view should only contain samples that match the
  given filter
- Improved performance when ingesting video datasets with frame-level labels

Utils
^^^^^
- Added a :meth:`reencode_videos() <fiftyone.utils.video.reencode_videos>`
  utility to re-encode the videos in a sample collection so that they are
  visualizable in the FiftyOne App

FiftyOne 0.6.2
--------------
*Released October 15, 2020*

App
^^^
- Improved page and grid load times for video datasets by around 10x
- Added filtering, toggling, and statistics for labels with respect to the
  frame schema in the display options sidebars for video datasets
- Added margins to the grid view for both image and video datasets
- Fixed list parameter input submission in the view bar
- Fixed an issue causing some label counts to be incorrect after filters are
  applied
- Added support for using the keyboard to select labels when filtering

Core
^^^^
- |Polyline| instances can now represent objects composed of multiple shapes
- Segmentations can now be :ref:`imported <COCODetectionDataset-import>` and
  :ref:`exported <COCODetectionDataset-export>` when using
  `COCO Object Detection Format <https://cocodataset.org/#format-data>`_.
- Polylines and keypoints can now be :ref:`imported <CVATImageDataset-import>` and
  :ref:`exported <CVATImageDataset-export>` when using
  `CVAT image format <https://github.com/openvinotoolkit/cvat/blob/develop/cvat/apps/documentation/xml_format.md>`_
- Polylines and keypoints can now be :ref:`imported <CVATVideoDataset-import>` and
  :ref:`exported <CVATVideoDataset-export>` when using
  `CVAT video format <https://github.com/openvinotoolkit/cvat/blob/develop/cvat/apps/documentation/xml_format.md>`_
- Added support for filtering polylines and keypoints via new
  :meth:`filter_polylines() <fiftyone.core.collections.SampleCollection.filter_polylines>`
  and
  :meth:`filter_keypoints() <fiftyone.core.collections.SampleCollection.filter_keypoints>`
  view stages
- Added support for rendering annotated versions of video samples with their
  frame labels overlaid via
  :meth:`draw_labels() <fiftyone.core.collections.SampleCollection.draw_labels>`
- Added support for :ref:`launching quickstarts <cli-fiftyone-quickstart>` as
  remote sessions
- Added :meth:`Frames.update() <fiftyone.core.frame.Frames.update>` and
  :meth:`Frames.merge() <fiftyone.core.frame.Frames.merge>` methods to replace
  and merge video frames, respectively
- Fixed :meth:`Dataset.merge_samples() <fiftyone.core.dataset.Dataset.merge_samples>`
  to properly merge the frame-by-frame contents of video samples
- Fixed a bug where :meth:`sample.copy() <fiftyone.core.sample.Sample.copy>`
  would not create a copy of the frames of a video sample

Brain
^^^^^
- :meth:`compute_uniqueness() <fiftyone.brain.compute_uniqueness>` and
  :meth:`compute_hardness() <fiftyone.brain.compute_hardness>` now support
  multilabel classification tasks

FiftyOne 0.6.1
--------------
*Released October 7, 2020*

App
^^^
- Added support for visualizing keypoints, polylines, and segmentation masks
- Added autocompletion when selecting `SortBy` fields in the view bar
- Added support for viewing `index` fields of |Detection| labels in the media
  viewer, if present
- Fixed counting of |Classifications| fields in the expanded sample view
- Fixed a bug that prevented label filters from fully resetting when a `reset`
  or `clear` button is pressed

Core
^^^^
- Added support for storing :class:`keypoints <fiftyone.core.labels.Keypoint>`,
  :class:`polylines <fiftyone.core.labels.Polyline>`, and
  :class:`segmentation masks <fiftyone.core.labels.Segmentation>` on samples
- Added support for setting an `index` attribute on |Detection| instances that
  defines a unique identifier for an object (e.g., across frames of a video)
- Added support for :ref:`importing <YOLODataset-import>` and
  :ref:`exporting <YOLODataset-export>` datasets in
  `YOLO format <https://github.com/AlexeyAB/darknet>`_
- Added support for :ref:`importing <CVATVideoDataset-import>` and
  :ref:`exporting <CVATVideoDataset-export>` datasets in
  `CVAT video format <https://github.com/openvinotoolkit/cvat/blob/develop/cvat/apps/documentation/xml_format.md>`_
- Added support for :ref:`importing <FiftyOneDataset-import>` and
  :ref:`exporting <FiftyOneDataset-export>` video datasets in
  :class:`FiftyOneDataset <fiftyone.types.dataset_types.FiftyOneDataset>`
  format
- Added frame field schemas to string representations for video datasets/views

CLI
^^^
- Added options to
  :ref:`fiftyone datasets delete <cli-fiftyone-datasets-delete>` to delete all
  datasets matching a pattern and all non-persistent datasets

Documentation
^^^^^^^^^^^^^
- Added a recipe for :doc:`merging datasets </recipes/merge_datasets>`
- Fixed some table widths and other display issues

FiftyOne 0.6.0
--------------
*Released October 1, 2020*

App
^^^
- Added support for visualizing video datasets in the App

Core
^^^^
- Added support for :ref:`storing frame labels <video-frame-labels>` on
  video samples
- Added support for :ref:`importing <VideoDirectory-import>` and
  :ref:`exporting <VideoDirectory-export>` datasets of unlabeled videos
- Added support for :ref:`importing <FiftyOneVideoLabelsDataset-import>` and
  :ref:`exporting <FiftyOneVideoLabelsDataset-export>` labeled video
  datasets in
  `ETA VideoLabels format <https://github.com/voxel51/eta/blob/develop/docs/video_labels_guide.md>`_.
- Added support for :ref:`importing <writing-a-custom-dataset-importer>` and
  :ref:`exporting <writing-a-custom-dataset-exporter>` video datasets in
  custom formats
- Improved the performance of
  :meth:`Dataset.rename_sample_field() <fiftyone.core.dataset.Dataset.rename_sample_field>`
- Added support for using disk space when running aggregation pipelines on
  large datasets
- Added support for automatically creating database indexes when sorting by
  sample fields, for efficiency
- Fixed issues with serializing vector fields and numpy arrays

FiftyOne 0.5.6
--------------
*Released September 23, 2020*

App
^^^
- Added autocompletion to view bar stage fields that accept field names (for
  example, :class:`Exists <fiftyone.core.stages.Exists>`)
- Fixed an issue that would prevent datasets with no numeric labels or scalars
  from loading in the App
- Fixed an error that could occur when a view included no samples
- Added notifications in the App that are displayed if errors occur on the
  backend
- Improved keyboard navigation between view bar stages

Core
^^^^
- Added support for loading (possibly-randomized) subsets of datasets when
  importing them via |DatasetImporter| instances, or via factory methods such
  as :meth:`Dataset.from_dir() <fiftyone.core.dataset.Dataset.from_dir>`
- Added support for optionally skipping unlabeled images when importing image
  datasets via |LabeledImageDatasetImporter| instances
- Added a
  :meth:`Dataset.merge_samples() <fiftyone.core.dataset.Dataset.merge_samples>`
  method for merging samples in datasets via joining by ``filepath``
- Added a
  :meth:`Dataset.rename_sample_field() <fiftyone.core.dataset.Dataset.rename_sample_field>`
  method for renaming sample fields of datasets

FiftyOne 0.5.5
--------------
*Released September 15, 2020*

App
^^^
- Added support for filtering samples by numeric fields in the sidebar
- Confidence bounds are now computed for the confidence slider in the label
  filter - a `[0, 1]` range is no longer assumed
- Fixed an issue that would cause certain stages to be reevaluated when the view
  bar was edited
- Improved responsiveness when adding stages in the view bar, filtering, and
  selecting samples
- Simplified placeholders in the view bar
- Added support for filtering sample JSON in the expanded sample view to match
  the objects displayed in the media viewer
- Updated the instructions that appear when starting the App before connecting
  to a session

Core
^^^^
- Added support for :meth:`Session.wait() <fiftyone.core.session.Session.wait>`
  for remote sessions, to make starting a remote session from a script easier

FiftyOne 0.5.4
--------------
*Released September 9, 2020*

App
^^^
- Added support for selecting/excluding samples from the current view in the
  App by selecting them and then choosing the appropriate option from a sample
  selection menu
- Added autocomplete when creating new stages in the view bar
- Updated the look-and-feel of the view bar to clarify when a stage and/or the
  entire view bar are active, and to make the bar more visually consistent with
  the rest of the App
- Media viewer options are maintained while browsing between samples in
  expanded sample view
- Improved the look-and-feel of confidence sliders when filtering labels
- Limited floating point numbers to three decimals when rendering them in the
  media viewer
- Fixed some bugs related to content overflow in the view bar

Core
^^^^
- Added support for exporting |Classification| labels in dataset formats that
  expect |Detections| labels
- Added support for importing/exporting supercategories for datasets in
  :ref:`COCO format <COCODetectionDataset-import>`

FiftyOne 0.5.3
--------------
*Released September 1, 2020*

App
^^^
- Added support for filtering labels in the expanded sample view
- Added support for displaying detection attributes in the expanded sample view
- Added an option to display confidence when viewing labels in the expanded
  sample view
- Updated look-and-feel of display options in the expanded sample view to match
  the main image grid view
- Adopting a default color palette for sample fields in the App that ensures
  that they are visually distinct
- Fixed a bug that prevented the App from loading empty views
- Fixed a bug that prevented the view bar from using default values for some
  stage parameters

Core
^^^^
- Added support for checking that a field *does not* exist via a new boolean
  parameter of the
  :meth:`exists() <fiftyone.core.collections.SampleCollection.exists>`
  view stage
- Fixed a bug that prevented FiftyOne from starting for some Windows users
- Fixed a bug that caused
  :meth:`take() <fiftyone.core.collections.SampleCollection.take>` and
  :meth:`shuffle() <fiftyone.core.collections.SampleCollection.shuffle>` view
  stages with random seeds to be regenerated when handing off between the App
  and Python shell

FiftyOne 0.5.2
--------------
*Released August 26, 2020*

App
^^^
- Added a label filter to the App that allows you to interactively explore your
  labels, investigating things like confidence thresholds, individual classes,
  and more, directly from the App
- Added an App error page with support for refreshing the App if something goes
  wrong
- The App can now be closed and reopened within the same session

Core
^^^^
- Added a :ref:`fiftyone quickstart <cli-fiftyone-quickstart>` command that
  downloads a small dataset, launches the App, and prints some suggestions for
  exploring the dataset
- Added support for multiple simultaneous FiftyOne processes. You can now
  operate multiple App instances (using different ports), Python shells, and/or
  CLI processes.
- Added support for automatically expanding labels from multitask formats such
  as :ref:`BDDDataset <BDDDataset-import>` and
  :ref:`FiftyOneImageLabelsDataset <FiftyOneImageLabelsDataset-import>` into
  separate label fields when importing datasets
- Added support for exporting multiple label fields in supported formats such
  as :ref:`BDDDataset <BDDDataset-export>` and
  :ref:`FiftyOneImageLabelsDataset <FiftyOneImageLabelsDataset-export>`
  via the :meth:`export() <fiftyone.core.collections.SampleCollection.export>`
  method
- Added support for filtering fields via the
  :meth:`filter_field() <fiftyone.core.collections.SampleCollection.filter_field>`
  method
- Provided a more helpful error message when using the
  :ref:`Dataset Zoo <dataset-zoo>` with no backend ML framework installed
- Made ``pycocotools`` an optional dependency to make installation on Windows
  easier

Docs
^^^^
- Added a
  `getting started with FiftyOne <https://github.com/voxel51/fiftyone/blob/develop/WALKTHROUGH.md>`_
  walkthrough to the GitHub repository
- Updated the :doc:`evaluate object detections </tutorials/evaluate_detections>`
  tutorial to make it more friendly for execution on CPU-only machines
- Added
  :meth:`detailed examples <fiftyone.core.collections.SampleCollection.filter_detections>`
  of using view stages to the docs
- Refreshed all App-related media in the docs to reflect the new App design
  introduced in v0.5.0

FiftyOne 0.5.1
--------------
*Released August 18, 2020*

App
^^^
- Statistics in the display options sidebar now reflect the current
  :ref:`view <using-views>`, not the entire :ref:`dataset <using-datasets>`
- Improved image tiling algorithm that prevents single images from filling an
  entire grid row
- Added support for toggling label visibility within the expanded sample modal
- Improved display of long label and tag names throughout the app
- Enhanced view bar functionality, including keyword arguments, type
  annotations, error messages, help links, and overall stability improvements
- Added keyboard shortcuts for interacting with the view bar:
   - `DEL` and `BACKSPACE` delete the raised (active) stage
   - `ESC` toggles focus on the ViewBar, which activates shortcuts
   - `TAB`, `ENTER`, and `ESC` submits stage input fields
   - `LEFT` and `RIGHT ARROW` traverses view stages and add-stage buttons
   - `SHIFT + LEFT ARROW` and `SHIFT + RIGHT ARROW` traverse stages

Core
^^^^
- Greatly improved the performance of loading dataset samples from the database
- Added support for :meth:`renaming <fiftyone.core.dataset.Dataset.name>` and
  :meth:`cloning <fiftyone.core.dataset.Dataset.clone>` datasets
- Added more string matching operations when
  :ref:`querying samples <querying-samples>`, including
  :meth:`starts_with() <fiftyone.core.expressions.ViewExpression.starts_with>`,
  :meth:`ends_with() <fiftyone.core.expressions.ViewExpression.ends_with>`,
  :meth:`contains_str() <fiftyone.core.expressions.ViewExpression.contains_str>` and
  :meth:`matches_str() <fiftyone.core.expressions.ViewExpression.matches_str>`

Documentation
^^^^^^^^^^^^^
- Added :doc:`a tutorial </tutorials/open_images_evaluation>` demonstrating
  performing error analysis on the
  `Open Images Dataset <https://storage.googleapis.com/openimages/web/index.html>`_
  powered by FiftyOne

FiftyOne 0.5.0
--------------
*Released August 11, 2020*

Announcements
^^^^^^^^^^^^^
- FiftyOne is now open source! Read more about this exciting development
  `in our press release <https://voxel51.com/press/fiftyone-open-source-launch>`_

App
^^^
- Major design refresh, including a
  `new look-and-feel for the App <https://voxel51.com/docs/fiftyone/_static/images/release-notes/v050_release_app.png>`_
- Added view bar that supports constructing dataset views directly in the App
- Redesigned expanded sample view:
    - Improved look-and-feel, with modal-style form factor
    - Added support for maximizing the media player
    - Added support for maximizing the raw sample view
    - Added arrow controls to navigate between samples

Core
^^^^
- Added support for :ref:`importing <FiftyOneDataset-import>` and
  :ref:`exporting <FiftyOneDataset-export>` FiftyOne datasets via the
  :class:`FiftyOneDataset <fiftyone.types.dataset_types.FiftyOneDataset>` type
- Added a :meth:`Dataset.info <fiftyone.core.dataset.Dataset.info>` field that
  can be used to store dataset-level info in FiftyOne datasets
- Added a :meth:`shuffle() <fiftyone.core.collections.SampleCollection.shuffle>`
  view stage for randomly shuffling the samples in a dataset
- Upgraded the :meth:`take() <fiftyone.core.collections.SampleCollection.take>`
  view stage so that each instance of a view maintains a deterministic set of
  samples

FiftyOne 0.4.1
--------------
*Released August 4, 2020*

Core
^^^^
- Added a powerful :mod:`fiftyone.core.expressions` module for constructing
  complex DatasetView :meth:`match() <fiftyone.core.collections.SampleCollection.match>`,
  :meth:`filter_classifications() <fiftyone.core.collections.SampleCollection.filter_classifications>`,
  :meth:`filter_detections() <fiftyone.core.collections.SampleCollection.filter_detections>`, and
  :meth:`sort_by() <fiftyone.core.collections.SampleCollection.sort_by>` stages
- Added an
  :meth:`evaluate_detections() <fiftyone.utils.eval.coco.evaluate_detections>`
  utility for evaluating object detections in FiftyOne datasets
- Adding support for rendering annotated versions of sample data with their
  labels overlaid via a
  :meth:`draw_labels() <fiftyone.core.collections.SampleCollection.draw_labels>`
  method

Documentation
^^^^^^^^^^^^^
- Added :doc:`a tutorial </tutorials/evaluate_detections>` demonstrating
  object detection evaluation workflows powered by FiftyOne
- Added :doc:`full documentation </user_guide/using_views>` for constructing
  DatasetViews with powerful matching, filtering, and sorting operations
- Added :doc:`a recipe </recipes/draw_labels>` showing how to render annotated
  versions of samples with label field(s) overlaid
- Upgraded :doc:`dataset creation docs </user_guide/dataset_creation/index>`
  that simplify the material and make it easier to find the creation strategy
  of interest
- Improved layout of :doc:`tutorials </tutorials/index>`,
  :doc:`recipes </recipes/index>`, and :doc:`user guide </user_guide/index>`
  landing pages

FiftyOne 0.4.0
--------------
*Released July 21, 2020*

Core
^^^^
- Added support for importing datasets in custom formats via the
  |DatasetImporter| interface
- Added support for exporting datasets to disk in custom formats via the
  |DatasetExporter| interface
- Added support for parsing individual elements of samples in the
  |SampleParser| interface
- Added an option to image loaders in :mod:`fiftyone.utils.torch` to convert
  images to RGB
- Fixed an issue where
  :meth:`Dataset.delete_sample_field() <fiftyone.core.dataset.Dataset.delete_sample_field>`
  would not permanently delete fields if they were modified after deletion
- Improved the string representation of |ViewStage| instances

App
^^^
- Fixed an issue that could cause launching the App to fail on Windows under
  Python 3.6 and older

Documentation
^^^^^^^^^^^^^
- Added a recipe demonstrating how to
  :doc:`convert datasets </recipes/convert_datasets>` on disk between common
  formats
- Added recipes demonstratings how to write your own
  :doc:`custom dataset importers </recipes/custom_importer>`,
  :doc:`custom dataset exporters </recipes/custom_exporter>`, and
  :doc:`custom sample parsers </recipes/custom_parser>`
- Added a :doc:`Configuring FiftyOne </user_guide/config>` page to the User
  Guide that explains how to customize your FiftyOne Config

FiftyOne 0.3.0
--------------
*Released June 24, 2020*

Core
^^^^
- Added support for importing and exporting datasets in several common formats:
    - COCO: :class:`COCODetectionDataset <fiftyone.types.dataset_types.COCODetectionDataset>`
    - VOC: :class:`VOCDetectionDataset <fiftyone.types.dataset_types.VOCDetectionDataset>`
    - KITTI: :class:`KITTIDetectionDataset <fiftyone.types.dataset_types.KITTIDetectionDataset>`
    - Image classification TFRecords:
      :class:`TFImageClassificationDataset <fiftyone.types.dataset_types.TFImageClassificationDataset>`
    - TF Object Detection API TFRecords:
      :class:`TFObjectDetectionDataset <fiftyone.types.dataset_types.TFObjectDetectionDataset>`
    - CVAT image: :class:`CVATImageDataset <fiftyone.types.dataset_types.CVATImageDataset>`
    - Berkeley DeepDrive: :class:`BDDDataset <fiftyone.types.dataset_types.BDDDataset>`
- Added :meth:`Dataset.add_dir() <fiftyone.core.dataset.Dataset.add_dir>` and
  :meth:`Dataset.from_dir() <fiftyone.core.dataset.Dataset.from_dir>` to allow
  for importing datasets on disk in any supported format
- Added a :meth:`convert_dataset() <fiftyone.utils.data.converters.convert_dataset>`
  method to convert between supported dataset formats
- Added support for downloading COCO 2014/2017 through the FiftyOne Dataset Zoo
  via the Torch backend

App
^^^
- Fixed an issue that could prevent the App from connecting to the FiftyOne
  backend

CLI
^^^
- Added `fiftyone convert` to convert datasets on disk between any supported
  formats
- Added `fiftyone datasets head` and `fiftyone datasets tail` to print the
  head/tail of datasets
- Added `fiftyone datasets stream` to stream the samples in a dataset to the
  terminal with a `less`-like interface
- Added `fiftyone datasets export` to export datasets in any available format

FiftyOne 0.2.1
--------------
*Released June 19, 2020*

Core
^^^^
- Added preliminary Windows support
- :meth:`Dataset.add_images_dir() <fiftyone.core.dataset.Dataset.add_images_dir>`
  now skips non-images
- Improved performance of adding samples to datasets

CLI
^^^
- Fixed an issue that could cause port forwarding to hang when initializing a
  remote session

FiftyOne 0.2.0
--------------
*Released June 12, 2020*

Core
^^^^
- Added support for persistent datasets
- Added a class-based view stage approach via the |ViewStage| interface
- Added support for serializing collections as JSON and reading datasets from
  JSON
- Added support for storing numpy arrays in samples
- Added a config option to control visibility of progress bars
- Added progress reporting to
  :meth:`Dataset.add_samples() <fiftyone.core.dataset.Dataset.add_samples>`
- Added a :meth:`SampleCollection.compute_metadata() <fiftyone.core.collections.SampleCollection.compute_metadata>`
  method to enable population of the `metadata` fields of samples
- Improved reliability of shutting down the App and database services
- Improved string representations of |Dataset| and |Sample| objects

App
^^^
- Added distribution graphs for label fields
- Fixed an issue causing cached images from previously-loaded datasets to be
  displayed after loading a new dataset

CLI
^^^
- Added support for creating datasets and launching the App
