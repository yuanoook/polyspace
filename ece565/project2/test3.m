% ece565-20 summer project 2 - test 1

github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

circular_stroke = imread([github_img_host 'circular_stroke.tif']);

size(circular_stroke)
imshow(circular_stroke);

circular_stroke_smooth = smoothimage(circular_stroke, 9);
imshow(circular_stroke_smooth, []);

% Failed otsu thresholding
circular_stroke_smooth_otsu = otsu_global_thresholding(circular_stroke_smooth);
imshow(circular_stroke_smooth_otsu, []);

% Succeeded otsu thresholding
circular_stroke_smooth_basicthresh = basic_global_thresholding(circular_stroke_smooth);
imshow(circular_stroke_smooth_basicthresh, []);
