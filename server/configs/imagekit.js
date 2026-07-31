import ImageKit from '@imagekit/nodejs'

var imagrkit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KRY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KRY ,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
})

export default ImageKit;