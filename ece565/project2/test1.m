% ece565-20 summer project 2 - test 1

github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

noisy_fingerprint = imread([github_img_host 'noisy_fingerprint.tif']);

size(noisy_fingerprint)
imshow(noisy_fingerprint);

imhist(noisy_fingerprint);

fingerprint_bgt = basic_global_thresholding(noisy_fingerprint);
imshow(fingerprint_bgt, []);

histogram(fingerprint_bgt);

function y = basic_global_thresholding(img)
  t = find_basic_threshold(img);
  y = global_thresholding(img, t);
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
