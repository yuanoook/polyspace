%{
  Function: localhisteq
  Author: Huiming Yuan
  Date: 8th-July-2020
%}

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
  center = a(height_half + 1, width_half + 1);
  [center_hist_accumulation, ~] = size(a(a <= center));

  pixel_count = height * width;
  y = floor(255 * center_hist_accumulation / pixel_count);
end
