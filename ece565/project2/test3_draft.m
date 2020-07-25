github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

circular_stroke = imread([github_img_host 'circular_stroke.tif']);

[height, width] = size(circular_stroke);
imshow(circular_stroke);

circular_stroke_smooth = smoothimage(circular_stroke, 9);
imshow(circular_stroke_smooth, []);

circular_stroke_smooth_otsu = otsu_global_thresholding(circular_stroke_smooth);
imshow(circular_stroke_smooth_otsu, []);

% Get outer boundaries
B = bwboundaries(circular_stroke_smooth_otsu, 'noholes');
outerb = cell2mat(B(1));
outerb_img = bound2im(outerb, height, width);
imshow(outerb_img, []);

[s, sUnit] = bsubsamp(outerb, 50)

outerb_polygon = connectpoly(s(:, 1), s(:, 2));
outerb_polygon_img = bound2im(outerb_polygon, height, width);
imshow(outerb_polygon_img, []);

fchc8 = fchcode(sUnit, 8)
mat2str(fchc8.fcc')
% '[2 2 2 2 0 2 2 0 2 0 0 0 0 6 0 6 6 6 6 6 6 6 6 4 4 4 4 4 4 2 4 2]'
mat2str(fchc8.diff')     
% '[0 0 0 0 6 2 0 6 2 6 0 0 0 6 2 6 0 0 0 0 0 0 0 6 0 0 0 0 0 6 2 6]'
mat2str(fchc8.mm')
% '[0 0 0 0 6 0 6 6 6 6 6 6 6 6 4 4 4 4 4 4 2 4 2 2 2 2 2 0 2 2 0 2]'
mat2str(fchc8.diffmm')
% '[6 0 0 0 6 2 6 0 0 0 0 0 0 0 6 0 0 0 0 0 6 2 6 0 0 0 0 6 2 0 6 2]'
mat2str(fchc8.x0y0)
% '[2 6]'

fchc4 = fchcode(sUnit, 4)
mat2str(fchc4.fcc')
% '[1 1 1 1 0 1 1 0 1 0 0 0 0 3 0 3 3 3 3 3 3 3 3 2 2 2 2 2 2 1 2 1]'
mat2str(fchc4.diff')
% '[0 0 0 0 3 1 0 3 1 3 0 0 0 3 1 3 0 0 0 0 0 0 0 3 0 0 0 0 0 3 1 3]'
mat2str(fchc4.mm')
% '[0 0 0 0 3 0 3 3 3 3 3 3 3 3 2 2 2 2 2 2 1 2 1 1 1 1 1 0 1 1 0 1]'
mat2str(fchc4.diffmm')
% '[3 0 0 0 3 1 3 0 0 0 0 0 0 0 3 0 0 0 0 0 3 1 3 0 0 0 0 3 1 0 3 1]'
mat2str(fchc4.x0y0)
% '[2 6]'







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
      g(row, col) = floor(mean2(f_pad(row:row+m-1, col:col+n-1)));
    end
  end
end

function mustBeOdd(x)
  if ~rem(x,2)
      error('Second,third inputs must be odd')
  end
end



%{
  Function: fchcode
  Author: Huiming Yuan
  Date: 25th-July-2020
%}

function c = fchcode(b, CONN)
  c = struct();
  % c.fcc = chain code (1 × 𝑛𝑝 where 𝑛𝑝 is the number of boundary pixels)
  c.fcc = get_chain_code(b, CONN);
  % c.diff = First difference of code c.fcc (1 × 𝑛𝑝)
  c.diff = get_chain_code_diff(c.fcc, CONN);
  % c.mm = Integer of minimum magnitude from c.fcc (1 × 𝑛𝑝)
  start_row = get_min_chain_code_start_row(c.fcc);
  % c.diffmm = First difference of code c.mm (1 × 𝑛𝑝)
  c.mm = [c.fcc(start_row:end); c.fcc(1:start_row - 1)];
  % c.x0y0 = Coordinates where the code starts (1 × 2)
  c.diffmm = [c.diff(start_row:end); c.diff(1:start_row-1)];
  c.x0y0 = b(start_row, :);
end

function d = get_chain_code_diff(c, CONN)
  len = length(c);
  d = zeros(len, 1);
  for k=1:len
    if (k == 1)
      d(k) = get_single_chain_code_diff(c(k), c(end), CONN);
    else
      d(k) = get_single_chain_code_diff(c(k), c(k-1), CONN);
    end
  end
end

function d = get_single_chain_code_diff(current_code, previous_code, CONN)
  d = current_code - previous_code;
  if (d < 0)
    d = d + CONN;
  end
end

function start_row = get_min_chain_code_start_row(c)
  c_min = min(c);
  len = length(c);
  [candidate_rows ~] = find(c == c_min);
  candidate_rows_len = length(candidate_rows);
  if (candidate_rows_len == length(c))
    start_row = 1;
    return
  end

  candidate_chains_len = zeros(candidate_rows_len, 1);
  next_row = 1;
  for k=1:candidate_rows_len
    row = candidate_rows(k);
    if (row < next_row)
      break;
    end
    chain_len = get_length_of_same_follow_chain_code(row, c, c_min);
    candidate_chains_len(k) = chain_len;
    next_row = get_next_row_in_loop(row, c, chain_len);
  end
  best_candidate_row_k = find(candidate_chains_len == max(candidate_chains_len), 1, 'first');
  start_row = candidate_rows(best_candidate_row_k);
end

function l = get_length_of_same_follow_chain_code(row, c, c_min)
  if (c(row) == c_min)
    next_row = get_next_row_in_loop(row, c, 1);
    l = 1 + get_length_of_same_follow_chain_code(next_row, c, c_min);
  else
    l = 1;
  end
end

function r = get_next_row_in_loop(row, c, step)
  if (row == length(c))
    r = step;
  else
    r = row + step;
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



function image = bound2im(b, M, N)
  % BOUND2IM Converts a boundary to an image.
  % IMAGE = BOUND2IM(b) converts b, an np-by-2 array containing the
  % integer coordinates of a boundary, into a binary image with 1s
  % in the locations of the coordinates in b and 0s elsewhere. The
  % height and width of the image are equal to the Mmin + H and Nmin
  % + W, where Mmin = min(b(:,1)) - 1, N = min(b(:,2)) - 1, and H
  % and W are the height and width of the boundary. In other words,
  % the image created is the smallest image that will encompass the
  % boundary while maintaining its original coordinate values.
  %
  % IMAGE = BOUND2IM(b, M, N) places the boundary in a region of
  % size M-by-N. M and N must satisfy the following conditions:
  %
  % M >= max(b(:,1)) - min(b(:,1)) + 1
  % N >= max(b(:,2)) - min(b(:,2)) + 1
  %
  % Typically, M = size(f, 1) and N = size(f, 2), where f is the
  % image from which the boundary was extracted. In this way, the
  % coordinates of IMAGE and f are registered with respect to each
  % other.
  % Check input.
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

function [s, sUnit] = bsubsamp(b, gridsep)
  %BSUBSAMP Subsample a boundary.
  % [S, SUNIT] = BSUBSAMP(B, GRIDSEP) subsamples the boundary B by
  % assigning each of its points to the grid node to which it is
  % closest. The grid is specified by GRIDSEP, which is the
  % separation in pixels between the grid lines. For example, if
  % GRIDSEP = 2, there are two pixels in between grid lines. So, for
  % instance, the grid points in the first row would be at (1,1),
  % (1,4), (1,6), ..., and similarly in the y direction. The value
  % of GRIDSEP must be an even integer. The boundary is specified by
  % a set of coordinates in the form of an np-by-2 array. It is
  % assumed that the boundary is one pixel thick.
  %
  % Output S is the subsampled boundary. Output SUNIT is normalized so
  % that the grid separation is unity. This is useful for obtaining
  % the Freeman chain code of the subsampled boundary. The outputs are
  % in the same order (clockwise or counterclockwise) as the input.
  % There are no duplicate points in the output.
  % Check input.
  [np, nc] = size(b);
  if np < nc
   error('B must be of size np-by-2.');
  end
  if isinteger(gridsep)
   error('GRIDSEP must be an integer.')
  end
  % Find the maximum span of the boundary.
  xmax = max(b(:, 1));
  ymax = max(b(:, 2));
  % Determine the integral number of grid lines with gridsep points in
  % between them that encompass the intervals [1,xmax], [1,ymax].
  GLx = ceil((xmax + gridsep)/(gridsep + 1));
  GLy = ceil((ymax + gridsep)/(gridsep + 1));
  % Form vectors of x and y grid locations.
  I = 1:GLx;
  J = 1:GLy;
  % Vector of grid line locations intersecting x-axis.
  X(I) = gridsep*I + (I - gridsep);
  % Vector of grid line locations intersecting y-axis.
  Y(J) = gridsep*J + (J - gridsep);
  [C, R] = meshgrid(Y, X);
  % Vector of grid all coordinates, arranged as Numbergridpoints-by-2
  % array to match the horizontal dimensions of b. This allows
  % computation of distances to be vectorized and this be much more
  % efficient.
  V = [C(1:end) ; R(1:end)]';
  % Compute the distance between every element of b and every element
  % of the grid.
  p = np;
  q = size(V, 1);
  D = sqrt(sum(abs(repmat(permute(b, [1 3 2]), [1 q 1])...
   - repmat(permute(V, [3 1 2]), [p 1 1])).^2, 3));
  % D(i, j) is the distance between the ith row of b and the jth
  % row of V. Find the min between each element of b and V.
  new_b = zeros(np, 2); % Preallocate memory.
  for I = 1:np
   idx = find(D(I,:) == min(D(I,:)), 1); % One min in row I of D.
   new_b(I,:) = V(idx, :);
  end
  % Eliminate duplicates and keep same order as input
  [s, m] = unique(new_b, 'rows');
  s = [s, m];
  s = fliplr(s);
  s = sortrows(s);
  s = fliplr(s);
  s = s(:, 1:2);
  % Scale to unit grid so that can use directly to obtain Freeman
  % chain codes. The shape does not change.
  sUnit = round(s./gridsep) + 1;
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


%{
  Function: otsu_global_thresholding
  Author: Huiming Yuan
  Date: 20th-July-2020
%}

function y = otsu_global_thresholding(img)
  [k, spb] = otsu_threshold(img)
  y = global_thresholding(img, k);
end

% Otsu's algorithm may be summarized as follows:
function [k, spb] = otsu_threshold(img)
  % step 1: Compute the normalized histogram of the input image. P(i), i = 0,1,2,...L-1
  p = hist_normalized(img);

  % step 2: Compute the cumulative sums P1(k), k = 0,1,2,...L-1
  p1 = cumulative_sums_of_hist_normalized(p);

  % step 3: Compute the cumulative means, m(k), k = 0,1,2,...L-1
  m = cumulative_means(p);

  % step 4: Compute the global mean, mg, mg = m(k), k = L-1
  mg = m(256)

  % step 5: Compute the between-class variance term, bcv(k), k = 0,1,2,...L-1
  bcv = between_class_variance(mg, p1, m);

  % step 6: Obtain the Otsu threshold, k*, as the value of k for which bcv(k) is maximum
  %         if the maximum is not unique, obtain k* by averaging the values of k

  k = k_of_bcv_max(bcv)

  % step 7: Compute the global variance bcvg, bcvg = bcv(k), k = L-1,
  %         and then obtain the separability measure, spb = bcv(k*) / bcvg
  gv = global_variance(mg, p)
  spb = bcv(k+1) / gv
end

function gv = global_variance(mg, p)
  gv = 0
  for intensity_value=0:255
    k = intensity_value + 1;
    variance = intensity_value - mg;
    gv = gv + variance * variance * p(k);
  end
end

function k = k_of_bcv_max(bcv)
  [rows, ~] = find(bcv == max(bcv))
  k = mean(rows) - 1
end

function bcv = between_class_variance(mg, p1, m)
  bcv = zeros(256, 1);
  for intensity_value=0:255
    k = intensity_value + 1;
    a = mg * p1(k) - m(k);
    b = p1(k) * (1 - p1(k));
    bcv(k) = a * a / b;
  end
end

function m = cumulative_means(p)
  m = zeros(256, 1);
  for intensity_value=0:255;
    k = intensity_value + 1;
    current_accum = p(k) * intensity_value;
    if (k == 1)
      m(k) = current_accum;
    else
      m(k) = m(k - 1) + current_accum;
    end
  end
end

function p1 = cumulative_sums_of_hist_normalized(p)
  p1 = zeros(256, 1);
  for intensity_value=0:255
    k = intensity_value + 1;
    if (k == 1)
      p1(k) = p(k);
    else
      p1(k) = p1(k - 1) + p(k);
    end
  end
end

function p = hist_normalized(img)
  [height width] = size(img);
  pixel_count = height * width;
  p = zeros(256, 1);
  for intensity_value=0:255
    k = intensity_value + 1;
    [intensity_occurrences ~] = size(img(img==intensity_value));
    p(k) = intensity_occurrences / pixel_count;
  end
end

function y = global_thresholding(img, threshold)
  y = img;
  y(img > threshold) = 1;
  y(img <= threshold) = 0;
end
