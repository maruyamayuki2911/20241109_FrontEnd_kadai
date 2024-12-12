let currentPlayer; //現在のプレイヤー
const panels = document.querySelectorAll('li');  //パネル要素取得
let dataInfo; // ドラッグしたパネルを格納する変数
let gameGuide = document.querySelector('.game-guide'); //ゲーム状況を表示する要素取得
const panelSoccer = document.querySelector('.panel-list--soccer'); //サッカーパネル要素取得　
const panelBadminton = document.querySelector('.panel-list--badminton'); //バドミントンパネル要素を取得


// ゲーム開始時のプレイヤーを選択
const gamePlayerSelection = () => {
  //ランダムにプレイヤーを決定
  currentPlayer = Math.random() < 0.5 ? 'soccer' : 'badminton';
  gameGuide.textContent = `ゲーム開始！！プレイヤー：${currentPlayer}`;

  // プレイヤー以外は非アクティブ状態にする
  if (currentPlayer === 'soccer') {
    panelBadminton.classList.add('inactive');
  } else {
    panelSoccer.classList.add('inactive');
  }
}
gamePlayerSelection();

// プレイヤーのターン管理
switchPlayer = () => {
  currentPlayer = dataInfo === 'badminton' ? 'soccer' : 'badminton';
  gameGuide.textContent = `プレイヤー：${currentPlayer}`;

  // プレイヤー以外は非アクティブ状態にする
  if (currentPlayer === 'soccer') {
    panelSoccer.classList.remove('inactive');
    panelBadminton.classList.add('inactive');
  } else {
    panelBadminton.classList.remove('inactive');
    panelSoccer.classList.add('inactive');
  }
}

// ドロップ可能にする
document.getElementById('game-board').addEventListener('dragover', (e) => {
  e.preventDefault();
});


// ドラッグの処理
panels.forEach((panel) => {
  panel.addEventListener('dragstart', (e) => {

    // ドラッグしたパネル情報を格納
    dataInfo = panel.dataset.panel;

    // 他のプレイヤーのパネルはドラッグ不可
    if (dataInfo !== currentPlayer) {
      e.preventDefault();
    }
  });
});

// ドロップ時の処理
document.querySelectorAll('.game-cell').forEach(cell => {
  cell.addEventListener('drop', (e) => {

    // セルにパネルがある時は置けない処理
    if (e.target.getAttribute('data-panel')) {
      return;
    }

    // セルにパネルを配置
    e.target.setAttribute('data-panel', dataInfo);

    switchPlayer(); //プレイヤーのターン管理
    handleMove(dataInfo); // 勝敗チェック
  });
});

// ゲームボードの状態を表す3x3の配列を作成し、各セルにパネルの情報を設定
const getBoardState = () => {
  // 多次元配列を生成
  const board = Array.from({ length: 3 }, () => Array(3).fill(''));

  // ▽盤面の考え方
  //          col
  //     ['0','1','2']
  // row ['0','1','2']
  //     ['0','1','2']


  // ドロップしたパネルに情報を設定
  document.querySelectorAll('.game-cell').forEach((cell) => {
    const row = parseInt(cell.getAttribute('data-row'), 10); //セル情報(行)を取得
    const col = parseInt(cell.getAttribute('data-col'), 10); //セル情報(列)を取得
    const panel = cell.getAttribute('data-panel'); //セルのパネル情報を取得
    board[row][col] = panel; //置かれたパネルを配列にセット

  });
  return board;
}

// 列がそろっているかの判定
const checkWin = (board, player) => {
  // 横のチェック
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
      return true;
    }
  }

  //縦のチェック
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
      return true;
    }
  }

  // 斜めのチェック
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true;
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true;
  }

  return false;
}

// 勝敗判定の処理
const handleMove = (player) => {
  const board = getBoardState();
  // returnがtrueの時に勝敗を表示
  if (checkWin(board, player)) {
    gameGuide.innerHTML = `
    <span class="game-result-text">${player}の勝ちです！</span>
    <button class="restart-btn">RETRY</button>
    `;

    panelOperation(); // パネルの操作を無効
    restart(); // リトライボタン押下時に画面をリロード
  }


  // 引き分け判定
  // セルが埋まっているかチェック
  const cellFull = board.every(row => row.every(cell => cell !== null));
  // 引き分けの場合は再戦の案内を出す
  if (cellFull) {
    gameGuide.innerHTML = `
    <span class="game-result-text">引き分けです！！</span>
    <button class="restart-btn">RETRY</button>
    `
    
    panelOperation(); // パネルの操作を無効
    restart(); // リトライボタン押下時に画面をリロード
  }
}

// パネルの操作を無効にする処理
const panelOperation = () => {
  panels.forEach((panel) => {
    panel.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  });
}

// リトライ時の処理
const restart = () => {
  document.querySelector('.restart-btn').addEventListener('click', () => {
    window.location.reload();
  });
}
