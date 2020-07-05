% a = imread('https://raw.githubusercontent.com/yuanoook/thruple/master/statics/test1.tif');
% imshow(a);
b = imread('https://raw.githubusercontent.com/yuanoook/thruple/master/statics/test2.tif');
imshow(b);
size(b)


b_fft = fft2(b);
magnitude_spectrum = abs(b_fft);
% Plot the 2d fourier transform of the signal
figure;
s_ft_ln = log(magnitude_spectrum);
surf(fftshift(s_ft_ln));
title('The Fourier transform | magnitude spectrum in 3D');
zlabel('exp');
colorbar;
colormap jet;
shading interp;
figure;
phase_spectrum = angle(b_fft);


figure;
imshow(fftshift(phase_spectrum), [])
title('The Fourier transform | phase spectrum');
colorbar;
colormap jet;


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



figure;
magnitude_spectrum_inverse = ifft2(magnitude_spectrum);
imshow(fftshift(log(magnitude_spectrum_inverse)), []);

imshow(magnitude_spectrum_inverse, []);

figure;
phase_spectrum = angle(b_fft);


phase_term = exp(phase_spectrum * 1i);
phase_term_inverse = ifft2(phase_term);

figure;
imshow(phase_term_inverse, []);


figure;
phase_term_inverse_abs = abs(phase_term_inverse);
imshow(phase_term_inverse_abs, []);


figure;
phase_term_inverse_real = real(phase_term_inverse);
imshow(phase_term_inverse_real, []);


phase_term_inverse_imag = imag(phase_term_inverse);

figure;
imshow(phase_term_inverse_imag, []);





conjugate_fft = magnitude_spectrum .* exp(-i * angle(b_fft));
conjugate_recovered = ifft2(conjugate_fft);
figure;
imshow(conjugate_recovered, []);

b_fft_conj = conj(b_fft);
b_fft_conj_recovered = ifft2(b_fft_conj);
figure;
imshow(b_fft_conj_recovered, []);