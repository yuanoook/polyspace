github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

chromosome = imread([github_img_host 'chromosome.tif']);

[height, width] = size(chromosome);
imshow(chromosome);

% Get outer boundaries
B = bwboundaries(chromosome, 'noholes');
outerb = cell2mat(B(1));
outerb_img = bound2im(outerb, height, width);
imshow(outerb_img, []);