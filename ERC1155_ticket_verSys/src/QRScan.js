import CreateQRScanner from 'component-qrscanner';

const QRScan = (e) => {
  const fn = (e) => {
    if(e.text) {
      alert('text: ' + e.text);
    }
    else {
      alert('error: ' +  e.error);
    }
  }
  const scanner = new CreateQRScanner(fn);
  scanner.start()
  return ( 
    <div></div>
  );
}
 
export default QRScan;
