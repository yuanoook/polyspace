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
      cell_histeq = histeq(cell);
      cell_histeq_center_pixel = cell_histeq(m_half+1, n_half+1);
      y(row, col) = cell_histeq_center_pixel;
    end
  end
end

function mustBeOdd(x)
  if ~rem(x,2)
      error('Second,third inputs must be odd')
  end
end
