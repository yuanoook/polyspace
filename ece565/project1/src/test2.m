b = imread('test2.tif');
imshow(b);
size(b)

b_fft = fft2(b);

% Display magnitude spectrum
figure;
magnitude_spectrum = abs(b_fft);
s_ft_ln = log(magnitude_spectrum);
surf(fftshift(s_ft_ln));
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
phase_term = exp(phase_spectrum * 1i);
phase_term_inverse = ifft2(phase_term);
figure;
phase_term_inverse_abs = abs(phase_term_inverse);
imshow(phase_term_inverse_abs, []);
figure;
phase_term_inverse_real = real(phase_term_inverse);
imshow(phase_term_inverse_real, []);
phase_term_inverse_imag = imag(phase_term_inverse);
figure;
imshow(phase_term_inverse_imag, []);

% (b) Display inverse transform of magnitude spectrum
figure;
magnitude_spectrum_inverse = ifft2(magnitude_spectrum);
imshow(fftshift(log(abs(magnitude_spectrum_inverse))), []);

% (c) Display inverse transform with conjugate of phase component
figure;
conjugate_fft = magnitude_spectrum .* exp(-i * angle(b_fft));
conjugate_recovered = ifft2(conjugate_fft);
imshow(conjugate_recovered, []);
