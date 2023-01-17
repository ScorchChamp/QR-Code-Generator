
window.addEventListener("load", function () {
const qrCodeElement = document.getElementById('qr-code');
const textElement = document.getElementById('text');
const errorCorrectionLevel = document.getElementById('error-correction-level');
const darkColor = document.getElementById('dark-color');
const lightColor = document.getElementById('light-color');
const imageFile = document.getElementById('image');
const qrCodeDownload = document.getElementById('qr-code-download-button');

document.getElementById('qr-form').addEventListener('input', updateQRCode);
document.getElementById('qr-form').addEventListener('submit', event => event.preventDefault());

function updateQRCodeImage() {
  const canvas = document.createElement('canvas');
  const opts = {
    errorCorrectionLevel: errorCorrectionLevel.value,
    type: 'image/jpeg',
    color: {
      dark: darkColor.value,
      light: lightColor.value,
    },
    width: 500,
    height: 500,
    margin: 1,
  }

  QRCode.toCanvas(canvas, textElement.value, opts, function (error) {
    if (error) {
      throw error;
    }
    var ctx = canvas.getContext('2d');
    var file = imageFile.files[0];
    if (file) {
      var img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        var maxWidth = canvas.width / 4;
        var maxHeight = canvas.height / 4;
        var width = img.width;
        var height = img.height;
        if (width > maxWidth || height > maxHeight) {
          var ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        var x = (canvas.width - width) / 2;
        var y = (canvas.height - height) / 2;
        ctx.fillStyle = lightColor.value;
        ctx.fillRect((canvas.width / 2) - (maxWidth / 2) - 10, (canvas.height / 2) - (maxHeight / 2) - 10, maxWidth + 20, maxHeight + 20)
        ctx.drawImage(img, x, y, width, height);
        qrCodeElement.src = canvas.toDataURL();
        qrCodeDownload.href = qrCodeElement.src;
      };
    } else {
      qrCodeElement.src = canvas.toDataURL();
      qrCodeDownload.href = qrCodeElement.src;
    }
  });
}

function updateQRCode() {
  imageFile.disabled = ["L", "M"].includes(errorCorrectionLevel.value);

  requestAnimationFrame(updateQRCodeImage);
}

updateQRCode();
});
