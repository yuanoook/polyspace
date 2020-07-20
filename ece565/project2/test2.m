% ece565-20 summer project 2 - test 1

github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

polymersomes = imread([github_img_host 'polymersomes.tif']);

size(polymersomes)
imshow(polymersomes);

polymersomes_bgt = basic_global_thresholding(polymersomes);
imshow(polymersomes_bgt, []);

histogram(polymersomes_bgt);

function y = basic_global_thresholding(img)
  t = find_basic_threshold(img);
  y = global_thresholding(img, t);
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
  p = hist_normalized(img)
  p1 = cumulative_sums_of_hist_normalized(p)
  m = cumulative_means(p1)
  mg = m(255, 1)
  
end

function cumulative_means(p1)
  m = zeros(256, 1)
  for intensity_value=0:255
    current_accum = p(intensity_value+1, 1) * intensity_value
    if (intensity_value == 0)
      m(intensity_value+1, 1) = current_accum
    else
      m(intensity_value+1, 1) = m(intensity_value, 1) + current_accum
    end
  end
end

function p1 = cumulative_sums_of_hist_normalized(p)
  p1 = zeros(256, 1)
  for intensity_value=0:255
    if (intensity_value == 0)
      p1(intensity_value+1, 1) = p(intensity_value+1, 1)
    else
      p1(intensity_value+1, 1) = p1(intensity_value, 1) + p(intensity_value+1, 1)
    end
  end
end

function p = hist_normalized(img)
  [height width] = size(img)
  pixel_count = height * width
  p = zeros(256, 1)
  for intensity_value=0:255
    [intensity_occurrences ~] = img(img==intensity_value)
    p(intensity_value+1, 1) = intensity_occurrences / pixel_count
  end
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

function y = global_thresholding(img, threshold)
  y = img;
  y(img > threshold) = 1;
  y(img <= threshold) = 0;
end
