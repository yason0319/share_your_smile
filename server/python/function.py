import glob
import os
import json
import sys
from traceback import print_exc
from PIL import Image
from PIL.ExifTags import TAGS

def createJson(imageStore_path, json_path):

  types = ['jpg','jpeg']

  images = []

  string = ''

  for type in types:
    images.extend(glob.glob(imageStore_path + '/*' + type))

  string += '['

  for i in range(len(images)):
    _file = os.path.split(images[i])[1]
    _name = _file.split(' - ')[0]
    string += '{'
    string += '"src": "' + _file + '",'
    string += '"title": "' + _name + '",'
    string += '"visible": false '
    string += '}'
    if i < len(images) -1:
      string += ','

  string += ']'

  with open(json_path, mode='w') as f:
    f.write(string)

def getJsonData(json_path):
  if os.path.isfile(json_path) == True:
    json_open = open(json_path, 'r')
    json_load = json.load(json_open)
    print(len(json_load))

    for i in json_load:
      print(i)

def _exif(file_path):
    try:
        # simply format from bytes to str for json serialization
        def _format_bytes(obj_):
            res = {}
            for key_, value_ in obj_.items():
                if isinstance(value_, bytes):
                    res[key_] = "{}".format(value_)
                elif isinstance(value_, dict):
                    res[key_] = _format_bytes(value_)
                else:
                    res[key_] = value_
            return res

        # read exif
        with Image.open(file_path) as f:
            exif_ = f._getexif()
        # convert to readable dict
        info_ = {}
        for key_ in exif_.keys():
            tag_ = TAGS.get(key_, key_)
            # skip longer value
            if tag_ in ["MakerNote", "UserComment"]:
                continue
            info_[tag_] = exif_[key_]

        return _format_bytes(info_)

    except AttributeError:
        # it might not have exif attached ('exif_' is None)
        return {}
    except BaseException:
        raise

def list_exif(dir_path):
    # generator for picking up jpeg files
    def _scan():
        for root, _, files in os.walk(dir_path):
            for file_ in files:
                flags_ = [file_.lower().endswith(x)
                          for x in [".jpeg", ".jpg", ".jpe"]]
                if sum(flags_) > 0:
                    yield os.path.join(root, file_)
                else:
                    continue
    # check path
    if not os.path.isdir(dir_path):
        raise Exception("invalid directory path")

    # build info for each jpeg file
    res = []
    for item in _scan():
        path_ = os.path.normpath(item)
        buf_ = {"path": path_,
                "file": os.path.basename(path_),
                "dir": os.path.dirname(os.path.relpath(path_, dir_path))}
        # add metadata
        buf_["exif"] = _exif(path_)
        res.append(buf_)

    return res

def correctDirection(dir_path, save_path_):
  # make exist img table
  exist_files_ = []
  for exist_item in list_exif(save_path_):
    exist_files_.append(os.path.basename(exist_item["path"]))
  # print(exist_files_)

  # transpose and remove exif for each image files
  for item in [x for x in list_exif(dir_path) if x["exif"] != {}]:
    try:
      orientation_ = item["exif"]["Orientation"]
      # new file name with 'r' appended
      filename_ = os.path.basename(item["path"])

      match = False

      for exist_file in exist_files_:
        if exist_file == filename_:
          # print("match!!")
          match = True
          break

      if match == False:
        path_ = save_path_ + "/" + filename_
        print("save file: {} (orientation:{})...".format(path_, orientation_))
        trans_ = [0, 3, 1, 5, 4, 6, 2][orientation_ - 2]
        # save modified image as new file
        with Image.open(item["path"]) as image_:
          # transpose to upright angle
          if orientation_ > 2:
            image_ = image_.transpose(trans_)

          # resize image for slide show

          if image_.width > image_.height:
            max_length = image_.width
          else:
            max_length = image_.height

          if max_length > 1000:
            unit = max_length / 1000
          
            image_resize_ = image_.resize((int(image_.width/unit),int(image_.height/unit)))

            print("width : " + str(image_resize_.width))
            print("height : " + str(image_resize_.height))

            image_resize_.save(path_)
          
          else:
            image_.save(path_)

    except KeyError:
      # new file name with 'r' appended
      filename_ = os.path.basename(item["path"])

      match = False

      for exist_file in exist_files_:
        if exist_file == filename_:
          # print("match!!")
          match = True
          break

      if match == False:
        path_ = save_path_ + "/" + filename_
        # save modified image as new file
        with Image.open(item["path"]) as image_:

          # resize image for slide show

          if image_.width > image_.height:
            max_length = image_.width
          else:
            max_length = image_.height

          if max_length > 1000:
            unit = max_length / 1000
          
            image_resize_ = image_.resize((int(image_.width/unit),int(image_.height/unit)))

            print("width : " + str(image_resize_.width))
            print("height : " + str(image_resize_.height))

            image_resize_.save(path_)
          
          else:
            image_.save(path_)


