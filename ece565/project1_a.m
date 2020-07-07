a = imread('https://raw.githubusercontent.com/yuanoook/thruple/master/statics/test1.tif');
imshow(a);
size(a)

imshow(localhisteq(a), []);
imshow(localhisteq(a, 7), []);
imshow(histeq(a), []);

function y = localhisteq(f, m, n)
  arguments
      f (:,:) double
      m (1,1) double {mustBeOdd} = 3
      n (1,1) double {mustBeOdd} = m
  end

  [height, width] = size(f);
  m_half = floor(m / 2);
  n_half = floor(n / 2);
  f_pad = padarray(f, [m n], "symmetric");

  y = zeros(height, width);
  for row=1:height
    for col=1:width
      cell=f_pad(row:row+m-1, col:col+n-1);
      y(row, col) = local_histeq_filter(cell);
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
  cell_hist = zeros(256, 1);

  for row=1:height
    for col=1:width
      value = a(row, col);
      cell_hist(value) = cell_hist(value) + 1;
    end
  end

  height_half = floor(height / 2);
  width_half = floor(width / 2);
  pixel_count = height * width;
  center_pixel_value = a(height_half + 1, width_half + 1);

  center_pixel_value_cumulation = 0
  for row=1:center_pixel_value
    center_pixel_value_cumulation = center_pixel_value_cumulation + cell_hist(row);
  end

  y = floor(255 * center_pixel_value_cumulation / pixel_count);
end
