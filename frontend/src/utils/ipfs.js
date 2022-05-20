import pinataSDK from '@pinata/sdk';
const pinata = pinataSDK('3799fdbab1be4d637b3d', '98c96e06c069131def8437c08d5a25a32f92083ef01872b5acacc8a8ed3976ab');

export const getIpfsHash = async (data) => {
  const result = await pinata.pinJSONToIPFS(data, null);
  const hash = result.IpfsHash;
  return hash;
};

export const getIpfsHashFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append("pinata_api_key", "3799fdbab1be4d637b3d");
    headers.append("pinata_secret_api_key", "98c96e06c069131def8437c08d5a25a32f92083ef01872b5acacc8a8ed3976ab");
    var formdata = new FormData();
    formdata.append("file", file);
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: formdata
    };
    fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", requestOptions)
      .then(r => r.json())
      .then(r => {
        resolve(r.IpfsHash)
      })
      .catch(error => reject(error))
  })
};