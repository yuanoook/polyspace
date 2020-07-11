clear all;

a = imread('test1.tif');
imshow(a);
size(a)

figure;
imshow(localhisteq(a), []);

figure;
imshow(localhisteq(a, 7), []);

figure;
imshow(histeq(a), []);
