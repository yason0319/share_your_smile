# codeing: utf-8

import glob
import os
import json
import sys
import codecs
from traceback import print_exc

class ImageJson():

  def __init__(self):
    self.images = []
    self.post_num = 0

  def getJsonData(self, json_path):
    if os.path.isfile(json_path) == True:
      json_open = codecs.open(json_path, 'r', 'utf-8')
      images = json.load(json_open)

      self.images = images
      self.post_num = len(self.images)

      # for image in self.images:
      #   print(image['src'])

  def createJson(self, imageStore_path, json_path):
    types = ['jpeg','jpg','png']
    images = []

    is_update_json = False

    string = ''

    val = []

    for type in types:
      images.extend(glob.glob(imageStore_path + '/*' + type))

    string += '['

    print(str(len(images)))

    for i in range(len(images)):
      _file = os.path.split(images[i])[1]
      is_new_image = True
      _image = []

      for image in self.images:
        if image['src'] == _file:
          # print('match! ' + _file)
          is_new_image = False
          _image = image
          break

      frag_val = {'src': '', 'title': '', 'visible': False, 'post_no': 0}
      
      # just now uploaded image
      if is_new_image == True:
        is_update_json = True
        _name = _file.split(' - ')[0]

        # encode failure
        string += '{'
        string += '"src": "' + _file + '",'
        string += '"title": "' + _name + '",'
        string += '"visible": false,'
        string += '"post_no": ' + str(self.post_num + 1)
        string += '}'

        # encode success
        frag_val['src'] = _file
        frag_val['title'] = _name
        frag_val['post_no'] = self.post_num + 1

        self.post_num+=1
      # already uploaded image
      else:
        # encode failure
        string += '{'
        string += '"src": "' + _image['src'] + '",'
        string += '"title": "' + _image['title'] + '",'
        string += '"visible": false,'
        string += '"post_no": ' + str(_image['post_no'])
        string += '}'

        # encode success
        frag_val['src'] = _image['src']
        frag_val['title'] = _image['title']
        frag_val['post_no'] = _image['post_no']
      
      val.append(frag_val)

      if i < len(images) -1:
        string += ','

    string += ']'


    if is_update_json == True:
      with codecs.open(json_path, 'w', 'utf-8') as f:
        json.dump(val, f, ensure_ascii=False)