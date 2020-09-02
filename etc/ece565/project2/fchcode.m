%{
  Function: fchcode
  Author: Huiming Yuan
  Date: 25th-July-2020
%}

function c = fchcode(b, CONN)
  c = struct();
  % c.fcc = chain code (1 × 𝑛𝑝 where 𝑛𝑝 is the number of boundary pixels)
  c.fcc = get_chain_code(b, CONN);
  % c.diff = First difference of code c.fcc (1 × 𝑛𝑝)
  c.diff = get_chain_code_diff(c.fcc, CONN);
  % c.mm = Integer of minimum magnitude from c.fcc (1 × 𝑛𝑝)
  start_row = get_min_chain_code_start_row(c.fcc);
  % c.diffmm = First difference of code c.mm (1 × 𝑛𝑝)
  c.mm = [c.fcc(start_row:end); c.fcc(1:start_row - 1)];
  % c.x0y0 = Coordinates where the code starts (1 × 2)
  c.diffmm = [c.diff(start_row:end); c.diff(1:start_row-1)];
  c.x0y0 = b(start_row, :);
end

function d = get_chain_code_diff(c, CONN)
  len = length(c);
  d = zeros(len, 1);
  for k=1:len
    if (k == 1)
      d(k) = get_single_chain_code_diff(c(k), c(end), CONN);
    else
      d(k) = get_single_chain_code_diff(c(k), c(k-1), CONN);
    end
  end
end

function d = get_single_chain_code_diff(current_code, previous_code, CONN)
  d = current_code - previous_code;
  if (d < 0)
    d = d + CONN;
  end
end

function start_row = get_min_chain_code_start_row(c)
  c_min = min(c);
  len = length(c);
  [candidate_rows ~] = find(c == c_min);
  candidate_rows_len = length(candidate_rows);
  if (candidate_rows_len == length(c))
    start_row = 1;
    return
  end

  candidate_chains_len = zeros(candidate_rows_len, 1);
  next_row = 1;
  for k=1:candidate_rows_len
    row = candidate_rows(k);
    if (row < next_row)
      break;
    end
    chain_len = get_length_of_same_follow_chain_code(row, c, c_min);
    candidate_chains_len(k) = chain_len;
    next_row = get_next_row_in_loop(row, c, chain_len);
  end
  best_candidate_row_k = find(candidate_chains_len == max(candidate_chains_len), 1, 'first');
  start_row = candidate_rows(best_candidate_row_k);
end

function l = get_length_of_same_follow_chain_code(row, c, c_min)
  if (c(row) == c_min)
    next_row = get_next_row_in_loop(row, c, 1);
    l = 1 + get_length_of_same_follow_chain_code(next_row, c, c_min);
  else
    l = 1;
  end
end

function r = get_next_row_in_loop(row, c, step)
  if (row == length(c))
    r = step;
  else
    r = row + step;
  end
end

function c = get_chain_code(b, CONN)
  len = length(b);
  c = zeros(len, 1);
  for row = 1:len
    if (row == 1)
      c(row) = get_one_chain_code(b(end, :), b(row, :), CONN);
    else
      c(row) = get_one_chain_code(b(row - 1, :), b(row, :), CONN);
    end
  end
end

function c = get_one_chain_code(previous_point, current_point, CONN)
  vector = current_point - previous_point;
  row_diff = vector(1, 1);
  col_diff = vector(1, 2);
  codes = [
    0 1 0;
    2 0 0;
    0 3 0
  ];
  if (CONN == 8)
    codes = [
      3 2 1;
      4 0 0;
      5 6 7
    ];
  end
  c = codes(row_diff + 2, col_diff + 2);
end