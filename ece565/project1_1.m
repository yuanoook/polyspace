clear all;

a = imread('https://raw.githubusercontent.com/yuanoook/thruple/master/statics/test1.tif');
imshow(a);
size(a)

imshow(localhisteq(a), []);
% imshow(localhisteq(a, 7), []);
% imshow(histeq(a), []);

function g = localhisteq(f, m, n)
  arguments
      f (:,:) double
      m (1,1) double {mustBeOdd} = 3
      n (1,1) double {mustBeOdd} = m
  end

  [height, width] = size(f);
  m_half = floor(m / 2);
  n_half = floor(n / 2);
  f_pad = padarray(f, [m_half n_half], "symmetric");

  g = zeros(height, width);
  for row=1:height
    for col=1:width
      kernel_cell=f_pad(row:row+m-1, col:col+n-1);
      g(row, col) = local_histeq_filter(kernel_cell);
    end
  end
end

function mustBeOdd(x)
  if ~rem(x,2)
      error('Second,third inputs must be odd')
  end
end

function y = local_histeq_filter(a)
  [height, width] = size(a);
  height_half = floor(height / 2);
  width_half = floor(width / 2);
  center_pixel_value = a(height_half + 1, width_half + 1);
  center_pixel_value_hist_accumulation = 0;

  for row=1:height
    for col=1:width
      if a(row, col) <= center_pixel_value
        center_pixel_value_hist_accumulation = center_pixel_value_hist_accumulation + 1;
      end
    end
  end

  pixel_count = height * width;
  y = floor(255 * center_pixel_value_hist_accumulation / pixel_count);
end
