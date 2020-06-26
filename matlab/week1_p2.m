% Practice #2
% Using any programming language you feel comfortable with (it is though recommended to use the provided free Matlab), load an image and then perform a simple spatial 3x3 average of image pixels. In other words, replace the value of every pixel by the average of the values in its 3x3 neighborhood. If the pixel is located at (0,0), this means averaging the values of the pixels at the positions (-1,1), (0,1), (1,1), (-1,0), (0,0), (1,0), (-1,-1), (0,-1), and (1,-1). Be careful with pixels at the image boundaries. Repeat the process for a 10x10 neighborhood and again for a 20x20 neighborhood. Observe what happens to the image (we will discuss this in more details in the very near future, about week 3).

avatar_size = '128';
a = imread(['https://avatars3.githubusercontent.com/u/7521814?s=' avatar_size]);
test(a, 5)

b = randn(1, 1, 3)
repmat(b, 3, 5)

function test(img, sample_size)
  img_sample = im_sample(img, sample_size);
  size(img_sample)
  imshow(rescale(img_sample, 'InputMin', 0, 'InputMax', 255));
end

function [result, result_min] = im_sample(img, sample_size)
  [height, width, colors] = size(img);
  pad_size = floor(sample_size/2);
  img_pad = im_pad(img, pad_size);
  imshow(img_pad);
  figure;

  result_min = zeros(1, 1, colors);
  row_index = 0;
  for row=pad_size+1:sample_size:height+pad_size
    row_index = row_index + 1;
    col_index = 0;
    for col=pad_size+1:sample_size:width+pad_size
      col_index = col_index + 1;
      cell=img_pad(row-pad_size:row+pad_size, col-pad_size:col+pad_size, :);
      [cell_height, cell_width, ~] = size(cell);
      average = round(mean(cell, [1 2]));
%       if row_index == 1 && col_index == 1
%           average
%           size(average)
%           repmat(average, [cell_height cell_width])
%       end
      img_pad(row-pad_size:row+pad_size, col-pad_size:col+pad_size, :) = repmat(average, [cell_height cell_width]);
      result_min(row_index, col_index, :) = average;
    end
  end
  result = img_pad(pad_size+1:sample_size:height+pad_size, pad_size+1:sample_size:width+pad_size, :)
end

function y = im_pad(img, pad_size)
    y = padarray(img, [pad_size pad_size], "symmetric");
end




%%%%%%%%%%%%%%%%%%%%%

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
