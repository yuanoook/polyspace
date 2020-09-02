% ece565-20 summer project 2 - test 1

github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

polymersomes = imread([github_img_host 'polymersomes.tif']);

size(polymersomes)
imshow(polymersomes);

polymersomes_ogt = otsu_global_thresholding(polymersomes);
imshow(polymersomes_ogt, []);

histogram(polymersomes_ogt);
