%{
  Function: smoothimage
  Author: Huiming Yuan
  Date: 20th-July-2020
%}

function g = smoothimage(f, m, n)
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
      g(row, col) = mean2(f_pad(row:row+m-1, col:col+n-1));
    end
  end
end

function mustBeOdd(x)
  if ~rem(x,2)
      error('Second,third inputs must be odd')
  end
end
