clear all;

b = imread('test2.tif');
imshow(b);
size(b)

b_fft = fft2(b);

% Display magnitude spectrum
figure;
magnitude_spectrum = abs(b_fft);
surf(fftshift(log(magnitude_spectrum)));
title('The Fourier transform | magnitude spectrum in 3D');
zlabel('exp');
colorbar;
colormap jet;
shading interp;

% Display phase spectrum
figure;
phase_spectrum = angle(b_fft);
imshow(fftshift(phase_spectrum), [])
title('The Fourier transform | phase spectrum');
colorbar;
colormap jet;

% (a) Display inverse transform of phase spectrum
figure;
phase_term = exp(phase_spectrum * 1i);
phase_term_inverse = ifft2(phase_term);
imshow(real(phase_term_inverse), []);

% (b) Display inverse transform of magnitude spectrum
figure;
magnitude_spectrum_inverse = ifft2(magnitude_spectrum);
imshow(fftshift(real(log(magnitude_spectrum_inverse))), []);

% (c) Display inverse transform with conjugate of phase component
figure;
conjugate_fft = magnitude_spectrum .* exp(-i * angle(b_fft));
conjugate_recovered = ifft2(conjugate_fft);
imshow(real(conjugate_recovered), []);
