export default function ({ passPhrase,text }) {
  //パスワードはUTF-8エンコーディング
  var secret_passphrase = CryptoJS.enc.Utf8.parse(passPhrase);
  //alert(secret_passphrase.toString(CryptoJS.enc.Utf8));
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  var key128Bits500Iterations = CryptoJS.PBKDF2(secret_passphrase, salt, {
    keySize: 128 / 8,
    iterations: 500,
  });
  //初期化ベクトル（ブロック長と同じ）
  var iv = CryptoJS.lib.WordArray.random(128 / 8);
  //暗号化オプション（IV:初期化ベクトル, CBCモード, パディングモード：PKCS7
  var options = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };
  //暗号化内容のエンコーディングは「UTF-8」
  var message_text = CryptoJS.enc.Utf8.parse(text)


  var encrypted = CryptoJS.AES.encrypt(message_text,key128Bits500Iterations,options);
  var decrypted = CryptoJS.AES.decrypt(encrypted, key128Bits500Iterations,options);

  console.log(decrypted.toString(CryptoJS.enc.Utf8));
}
