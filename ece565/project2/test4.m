github_img_host = 'https://github.com/yuanoook/thruple/raw/master/ece565/project2/';

chromosome = imread([github_img_host 'chromosome.tif']);

[height, width] = size(chromosome);
imshow(chromosome);

% Get outer boundaries
B = bwboundaries(chromosome, 'noholes');
outerb = cell2mat(B(1));
outerb_img = bound2im(outerb, height, width);
imshow(outerb_img, []);

outerb_fdesc = fourierdescp(outerb);
fftplot(outerb_fdesc);

ifourierdescp_show(outerb_fdesc, 1, height, width);
ifourierdescp_show(outerb_fdesc, length(outerb) * 0.01, height, width);
ifourierdescp_show(outerb_fdesc, length(outerb) * 0.5, height, width);

function ifourierdescp_show_n(outerb_fdesc, n, height, width)
  for k=1:n
    ifourierdescp_show(outerb_fdesc, k, height, width);
  end
end

function ifourierdescp_show(outerb_fdesc, n, height, width)
  figure;
  outerb_k = ifourierdescp(outerb_fdesc, n*2);
  outerb_k_img = bound2im(outerb_k, height, width);
  imshow(outerb_k_img, []);
  title(n*2);
end

function s = ifourierdescp(z, nd)
  if rem(nd,2)
    error('Second,third inputs must be even')
  end
  z_nd = z;
  nd = floor(nd/2);
  z_nd(nd+1:end-nd) = 0;
  z_nd_ifft = ifft(z_nd);
  s = zeros(length(z_nd), 2);
  s(:, 1) = real(z_nd_ifft);
  s(:, 2) = imag(z_nd_ifft);
end

function z = fourierdescp(s)
  s_complex = complex(s(:, 1), s(:, 2));
  z = fft(s_complex);
end

function fftplot(f)
  figure;
  l = length(f);
  plot((-l/2:l/2-1), fftshift(log(abs(f))));
  title('Fourier transform of boundary in imaginary plane.');
  xlabel('f (Hz)');
  ylabel('Amplitude (exp)');
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