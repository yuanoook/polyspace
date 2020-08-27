const scatter3 = (x, y, z) => `
% Plot on matlab - https://www.mathworks.com/help/matlab/ref/scatter3.html

x = ${JSON.stringify(x).replace(/\,/g,';')};
y = ${JSON.stringify(y).replace(/\,/g,';')};
z = ${JSON.stringify(z).replace(/\,/g,';')};
scatter3(x,y,z,5,z,'filled');
set(gca,'xscale','log');
set(gca,'yscale','log');
set(gca,'zscale','log');
view([17 21]);
colormap(jet);
colorbar;

`

module.exports = {
  scatter3
}