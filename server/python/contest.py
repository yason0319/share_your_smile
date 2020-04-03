import image_json
import setting

if __name__ == "__main__":
  oprJson = image_json.ImageJson()

  oprJson.createJson(setting.CONTEST_IMAGE_PATH,setting.CONTEST_JSON_PATH)