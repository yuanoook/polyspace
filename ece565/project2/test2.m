% ece565-20 summer project 2 - test 1

github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

polymersomes = imread([github_img_host 'polymersomes.tif']);

size(polymersomes)
imshow(polymersomes);

polymersomes_ogt = otsu_global_thresholding(polymersomes);
imshow(polymersomes_ogt, []);

histogram(polymersomes_ogt);

function y = otsu_global_thresholding(img)
  [k, spb] = otsu_threshold(img)
  y = global_thresholding(img, k);
end

% Otsu's algorithm may be summarized as follows:
% step 1: Compute the normalized histogram of the input image. P(i), i = 0,1,2,...L-1
% step 2: Compute the cumulative sums P1(k), k = 0,1,2,...L-1
% step 3: Compute the cumulative means, m(k), k = 0,1,2,...L-1
% step 4: Compute the global mean, mg, mg = m(k), k = L-1
% step 5: Compute the between-class variance term, bcv(k), k = 0,1,2,...L-1
% step 6: Obtain the Otsu threshold, k*, as the value of k for which bcv(k) is maximum
%         if the maximum is not unique, obtain k* by averaging the values of k
% step 7: Compute the global variance bcvg, bcvg = bcv(k), k = L-1,
%         and then obtain the separability measure, spb = bcv(k*) / bcvg

function [k, spb] = otsu_threshold(img)
  p = hist_normalized(img);
  p1 = cumulative_sums_of_hist_normalized(p);
  m = cumulative_means(p);
  mg = m(256)
  bcv = between_class_variance(mg, p1, m);
  gv = global_variance(mg, p)
  k = k_of_bcv_max(bcv)
  spb = bcv(k+1) / bcvg
end

function gv = global_variance(mg, p)
  gv = 0
  for intensity_value=0:255
    k = intensity_value + 1;
    variance = intensity_value - mg
    gv = variance * variance * p(k)
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
