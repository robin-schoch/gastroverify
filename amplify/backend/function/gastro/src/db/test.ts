import {entryStorage} from './entryStorage';

const test = () => {
  const s = new entryStorage();
  s.findPaged('0ffb2963-dd8b-4903-8f06-766d0adb14a0', 100, null).subscribe(
      (elem) => {
        console.log('as');
        console.log(elem);
      }
  );
};

// test()
