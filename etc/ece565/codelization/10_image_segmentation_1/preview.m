%{
  The purpose of the file is to help Rango understand the text book
  by transfer to text book content to code, because Rango understands better with code.

  Steps
    Codelization
    Images
    Math
    Concepts

  Chapter 10 Image Segmentation

    Edge Detection
    Thresholding
    Region Detection

  The whole is equal to the sum of its parts - Euclid

  The whole is greater than the sum of its parts - Max Wertheimer
%}

the_whole = sum( get_all_parts(the_whole) ) % Euclid
the_whole >= sum( get_all_parts(the_whole) ) % Max Wertheimer

function [edge, thresholding, region] = image_segmentation(img)
  edge = edge_detection(img);
  thresholding = auto_thresholding(img);
  region = region_detection(img);
end

function output_image = image_processing_in_previous_chapter(input_image)
  % ...
end

function image_attributes = image_processing_in_following_chapter(input_image)
  % ...
end



% Basic functions
function pixel_discontinuity = get_pixel_discontinuity(pixel_with_neighbors)
  % ...
end

function pixel_similarity = get_pixel_similarity(pixel_with_neighbors)
  % ...
end

function partion_an_image(input_image)
  get_edge_from_an_image(input_image)
  get_regions_from_an_image(input_image)
end

function edge = get_edge_from_an_image(input_image)
  edge = zeros(size(input_image))
  for pixel in input_image
    if get_pixel_discontinuity(pixel) > thresholding
      edge(pixel) = pixel
    end
  end
end

function output = get_regions_from_an_image(input_image)
  region_growing
  region_spliting
  region_merging % clustering, superpixels
end

function [region1, region2, region3] = image_segmentation(whole_region)
  
end
