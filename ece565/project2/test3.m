% ece565-20 summer project 2 - test 1

github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

circular_stroke = imread([github_img_host 'circular_stroke.tif']);

[height, width] = size(circular_stroke)
imshow(circular_stroke);

circular_stroke_smooth = smoothimage(circular_stroke, 9);
imshow(circular_stroke_smooth, []);

circular_stroke_smooth_basicthresh = basic_global_thresholding(circular_stroke_smooth);
imshow(circular_stroke_smooth_basicthresh, []);

B = bwboundaries(circular_stroke_smooth_basicthresh,'noholes');
outerb = cell2mat(B(1));
outerb_img = bound2im(outerb, height, width);
imshow(outerb_img, []);
