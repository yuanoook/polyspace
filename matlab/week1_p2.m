% Practice #1
% Write a computer program capable of reducing the number of intensity levels in an image from 256 to 2, in integer powers of 2. The desired number of intensity levels needs to be a variable input to your program. Display Variable Values Create a variable with numbers and another variable with text.

size = '128';
a = imread(['https://avatars3.githubusercontent.com/u/7521814?s=' size]);
imshow(a);
test(rgb2gray(a));
test(a);

function y = im_downgrade(img, intensity_levels)
    y = round(img.*((intensity_levels - 1)/256));
end

function y = im_upgrade(img_downgraded, intensity_levels)
    y = img_downgraded.*(256/(intensity_levels - 1));
end

function test(img)
    for k = 1:8
        levels = 2.^k;
        img_down = im_downgrade(img, levels);
        new_img = im_upgrade(img_down, levels);
        imshow(new_img);
        figure;
        imhist(new_img);
        figure;
    end
end
