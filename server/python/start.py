import time
from traceback import print_exc
import glob

# original library
import setting
import function
# import config
import image_json


start = time.time()

cnt = 0

# start update photo
if __name__ == "__main__":
  
  oprJson = image_json.ImageJson()

  l = glob.glob(setting.FILE_FROM_PATH)

  print(l)

  try:
    # while True:
    #   time.sleep(3)
      # correct photo direction
      function.correctDirection(setting.FILE_FROM_PATH,setting.FILE_TO_PATH)

      #function.getJsonData(config.json_path_)
      oprJson.getJsonData(setting.JSON_PATH)

      # create json data of photo title and photo contributor as json/images.json
      # function.createJson(config.save_path_,config.json_path_)
      oprJson.createJson(setting.FILE_TO_PATH,setting.JSON_PATH)

      # cnt += 1
      # print(cnt)

  except BaseException:
    print_exc()
