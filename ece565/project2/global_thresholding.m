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
