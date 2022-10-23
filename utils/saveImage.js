import * as uuid from 'uuid';
import path from 'path';
import {__dirname} from '../index.js';

export default function(req) {
  try {
    const {image} = req.files;
    if (!image){
      return ''
    }
    let fileName = uuid.v4() + '.jpg';
    image.mv(path.resolve(__dirname, 'static', fileName));
    return fileName;
  } catch (e) {
    console.log(e);
    return '';
  }

}
