% ece565-20 summer project 2 - test 1

github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

noisy_fingerprint = imread([github_img_host 'noisy_fingerprint.tif']);

size(noisy_fingerprint)
imshow(noisy_fingerprint);

imhist(noisy_fingerprint);

fingerprint_bgt = basic_global_thresholding(noisy_fingerprint);
imshow(fingerprint_bgt, []);

histogram(fingerprint_bgt);
