% Practice #2
% Using any programming language you feel comfortable with (it is though recommended to use the provided free Matlab), load an image and then perform a simple spatial 3x3 average of image pixels. In other words, replace the value of every pixel by the average of the values in its 3x3 neighborhood. If the pixel is located at (0,0), this means averaging the values of the pixels at the positions (-1,1), (0,1), (1,1), (-1,0), (0,0), (1,0), (-1,-1), (0,-1), and (1,-1). Be careful with pixels at the image boundaries. Repeat the process for a 10x10 neighborhood and again for a 20x20 neighborhood. Observe what happens to the image (we will discuss this in more details in the very near future, about week 3).

avatar_size = '128';
a = imread(['https://avatars3.githubusercontent.com/u/7521814?s=' avatar_size]);
test(a, 19);

function test(img, sample_size)
  figure;
  imshow(img);
  [img_sample, img_sample_min] = im_sample(img, sample_size);
  figure;
  imshow(rescale(img_sample, 'InputMin', 0, 'InputMax', 255));
  figure;
  imshow(rescale(img_sample_min, 'InputMin', 0, 'InputMax', 255));
end

function [result, result_min] = im_sample(img, sample_size)
  [height, width, ~] = size(img);
  img_pad = im_pad(img, sample_size);
  half_sample_size = floor(sample_size / 2);

  for row=half_sample_size+1:sample_size:height+sample_size
    for col=half_sample_size+1:sample_size:width+sample_size
      cell=img_pad(row:row+sample_size-1, col:col+sample_size-1, :);
      [cell_height, cell_width, ~] = size(cell);
      average = round(mean(cell, [1 2]));
      img_pad(row:row+sample_size-1, col:col+sample_size-1, :) = repmat(average, [cell_height cell_width]);
    end
  end
  result = img_pad(sample_size+1:end-sample_size, sample_size+1:end-sample_size, :);
  result_min = img_pad(sample_size+1:sample_size:end-sample_size, sample_size+1:sample_size:end-sample_size, :);
end

function y = im_pad(img, pad_size)
    y = padarray(img, [pad_size pad_size], "symmetric");
end


