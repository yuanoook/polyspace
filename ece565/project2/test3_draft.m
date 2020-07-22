github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

circular_stroke = imread([github_img_host 'circular_stroke.tif']);

size(circular_stroke)
imshow(circular_stroke);

circular_stroke_smooth = smoothimage(circular_stroke, 9);
imshow(circular_stroke_smooth, []);

circular_stroke_smooth_basicthresh = basic_global_thresholding(circular_stroke_smooth);
imshow(circular_stroke_smooth_basicthresh, []);

% There's a mistake in PPT ece565-s20-6.feature-extraction.pdf
% Chain Codes - Example (8-bit image of a circular stroke) - Picture-c description
% It's most likely the smoothed image, thresholded using basic global thresholing method,
% not Otsu's method.
% TODO: email SA & teacher the mistake in PPT

circular_stroke_smooth_otsu = otsu_global_thresholding(circular_stroke_smooth);
imshow(circular_stroke_smooth_otsu, []);

B = bwboundaries(circular_stroke_smooth_basicthresh,'noholes');

outerb = cell2mat(B(1));
size(outerb)
% outerb
outerb_img = bound2im(outerb, 570, 570);
imshow(outerb_img, []);

[s, sUnit] = bsubsamp(outerb, 50)

outerb_polygon = connectpoly(s(:, 1), s(:, 2));
outerb_polygon_img = bound2im(outerb_polygon, 570, 570);
imshow(outerb_polygon_img, []);

ccode4 = get_chain_code(sUnit, 4);
mat2str(ccode4')
% '[1 1 1 1 0 1 1 0 1 0 0 0 0 3 0 3 3 3 3 3 3 3 3 2 2 2 2 2 2 1 2 1]'

ccode8 = get_chain_code(sUnit, 8);
mat2str(ccode8')
% '[2 2 2 2 0 2 2 0 2 0 0 0 0 6 0 6 6 6 6 6 6 6 6 4 4 4 4 4 4 2 4 2]'

ccode8_min = ccode8(:,:)
ccode8_min = ccode8(ccode8 != min(ccode8)) = 1

ccode4 = get_chain_code(sUnit, 4);
mat2str(ccode4')

ccode8 = get_chain_code(sUnit, 8);
mat2str(ccode8')
c8_min(c8_min != min(c8_min)) = 1;
mat2str(ccode8')
mat2str(c8_min')

function c = fchcode(b, CONN)
  % c.fcc = chain code (1 × 𝑛𝑝 where 𝑛𝑝 is the number of boundary pixels)
  % c.diff = First difference of code c.fcc (1 × 𝑛𝑝)
  % c.mm = Integer of minimum magnitude from c.fcc (1 × 𝑛𝑝)
  % c.diffmm = First difference of code c.mm (1 × 𝑛𝑝)
  % c.x0y0 = Coordinates where the code starts (1 × 2)
  fcc = get_chain_code(b, CONN)
end

% TODO: finish this shit
function m = get_min_chain_code(c)
  c_min = min(c);
  len = length(c);
  [rows ~] = find(c = c_min);
  rows_len = length(rows)
  if (rows_len == length(c))
    m = c;
    return
  end

end

function icm = is_chain_code_min(row, c, c_min)
  icm = c(row) == c_min
end

function incm = is_next_chain_code_min(row, c, c_min)
  im = get_next_chain_code(row, c) == c_min
end

function p = get_next_chain_code(row, c)
  p = c(get_next_chain_code_row(row))
end

function r = get_next_chain_code_row(row, c)
  if (row == length(c))
    r = 1
  else
    r = row + 1
  end
end

function c = get_chain_code(b, CONN)
  len = length(b);
  c = zeros(len, 1);
  for row = 1:len
    if (row == 1)
      c(row) = get_one_chain_code(b(end, :), b(row, :), CONN);
    else
      c(row) = get_one_chain_code(b(row - 1, :), b(row, :), CONN);
    end
  end
end

function c = get_one_chain_code(previous_point, current_point, CONN)
  vector = current_point - previous_point;
  row_diff = vector(1, 1);
  col_diff = vector(1, 2);
  codes = [
    0 1 0;
    2 0 0;
    0 3 0
  ];
  if (CONN == 8)
    codes = [
      3 2 1;
      4 0 0;
      5 6 7
    ];
  end
  c = codes(row_diff + 2, col_diff + 2);
end

function c = connectpoly(x, y)
  % CONNECTPOLY Connects vertices of a polygon.
  % C = CONNECTPOLY(X, Y) connects the points with coordinates given
  % in X and Y with straight lines. These points are assumed to be a
  % sequence of polygon vertices organized in the clockwise or
  % counterclockwise direction. The output, C, is the set of points
  % along the boundary of the polygon in the form of an nr-by-2
  % coordinate sequence in the same direction as the input. The last
  % point in the sequence is equal to the first.
  v = [x(:), y(:)];
  % Close the polygon.
  if ~isequal(v(end,:), v(1,:))
   v(end + 1, :) = v(1, :);
  end
  % Connect vertices.
  segments = cell(1, length(v) - 1);
  for I = 2:length(v)
   [x, y] = intline(v(I - 1, 1), v(I, 1), v(I - 1, 2), v(I, 2));
   segments{I - 1} = [x, y];
  end
  c = cat(1, segments{:});
end

function [x, y] = intline(x1, x2, y1, y2)
  %INTLINE Integer-coordinate line drawing algorithm.
  % [X, Y] = INTLINE(X1, X2, Y1, Y2) computes an
  % approximation to the line segment joining (X1, Y1) and
  % (X2, Y2) with integer coordinates. X1, X2, Y1, and Y2
  % should be integers. INTLINE is reversible; that is,
  % INTLINE(X1, X2, Y1, Y2) produces the same results as
  % FLIPUD(INTLINE(X2, X1, Y2, Y1)).
  dx = abs(x2 - x1);
  dy = abs(y2 - y1);
  % Check for degenerate case.
  if ((dx == 0) & (dy == 0))
   x = x1;
   y = y1;
   return;
  end
  flip = 0;
  if (dx >= dy)
   if (x1 > x2)
   % Always "draw" from left to right.
   t = x1; x1 = x2; x2 = t;
   t = y1; y1 = y2; y2 = t;
   flip = 1;
   end
   m = (y2 - y1)/(x2 - x1);
   x = (x1:x2).';
   y = round(y1 + m*(x - x1));
  else
   if (y1 > y2)
   % Always "draw" from bottom to top.
   t = x1; x1 = x2; x2 = t;
   t = y1; y1 = y2; y2 = t;
   flip = 1;
   end
   m = (x2 - x1)/(y2 - y1);
   y = (y1:y2).';
   x = round(x1 + m*(y - y1));
  end
  
  if (flip)
   x = flipud(x);
   y = flipud(y);
  end
end



function [s, sUnit] = bsubsamp(b, gridsep)
  [np, nc] = size(b);
  if np < nc
   error('B must be of size np-by-2.');
  end
  if isinteger(gridsep)
   error('GRIDSEP must be an integer.')
  end
  xmax = max(b(:, 1));
  ymax = max(b(:, 2));
  GLx = ceil((xmax + gridsep)/(gridsep + 1));
  GLy = ceil((ymax + gridsep)/(gridsep + 1));
  % Form vectors of x and y grid locations.
  I = 1:GLx;
  J = 1:GLy;
  X(I) = gridsep*I + (I - gridsep);
  Y(J) = gridsep*J + (J - gridsep);
  [C, R] = meshgrid(Y, X);
  V = [C(1:end) ; R(1:end)]';
  p = np;
  q = size(V, 1);
  D = sqrt(sum(abs(repmat(permute(b, [1 3 2]), [1 q 1])...
   - repmat(permute(V, [3 1 2]), [p 1 1])).^2, 3));
  new_b = zeros(np, 2); % Preallocate memory.
  for I = 1:np
   idx = find(D(I,:) == min(D(I,:)), 1); % One min in row I of D.
   new_b(I,:) = V(idx, :);
  end
  [s, m] = unique(new_b, 'rows');
  s = [s, m];
  s = fliplr(s);
  s = sortrows(s);
  s = fliplr(s);
  s = s(:, 1:2);
  sUnit = round(s./gridsep) + 1;
end

function image = bound2im(b, M, N)
  if size(b,2) ~= 2
   error('The boundary must be of size np-by-2')
  end
  % Make sure the coordinates are integers.
  b = round(b);
  % Defaults.
  if nargin == 1
   Mmin = min(b(:,1)) - 1;
   Nmin = min(b(:,2)) - 1;
   H = max(b(:,1)) - min(b(:,1)) + 1; % Height of boundary.
   W = max(b(:,2)) - min(b(:,2)) + 1; % Width of boundary.
   M = H + Mmin;
   N = W + Nmin;
  end
  % Create the image.
  image = false(M,N);
  linearIndex = sub2ind([M, N], b(:,1), b(:,2));
  image(linearIndex) = 1;
end

function y = basic_global_thresholding(img)
  t = find_basic_threshold(img);
  y = global_thresholding(img, t);
end

%{
  Function: global_thresholding
  Author: Huiming Yuan
  Date: 20th-July-2020
%}

function y = global_thresholding(img, threshold)
  y = img;
  y(img > threshold) = 1;
  y(img <= threshold) = 0;
end

function t = find_basic_threshold(img)
  t = mean(img, 'all');
  while true
    m1 = mean(img(img > t), 'all');
    m2 = mean(img(img <= t), 'all');
    new_t = (m1 + m2) / 2;

    if abs(new_t - t) < 1
      t = new_t;
      break
    end

    t = new_t;
  end
end

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

