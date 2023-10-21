const characters = [
    { name: "luffy", image: "/static/img/luffy.png", position: 1 },
    { name: "nami", image: "/static/img/nami.png", position: 1 }
  ];
  
  
  const events = [
    { name: "風に吹かれて２マス進めた", move: 2, cell: 3 },
    { name: "バギーに攻撃を喰らった。１マス戻る", move: -1, cell: 6 },
    { name: "おいしい肉を見つけた。２マス進む", move: 2, cell: 9 },
    { name: "海賊船が襲ってきた。５マス戻る", move: -5, cell: 12 },
    { name: "財宝を見つけた。２マス進む", move: 2, cell: 18 },
  ];
  
  new Vue({
    el: "#app",
    data: {
      playerPosition: 1,
      cpuPosition: 1,
      isPlayerTurn: true,
      isGameOver: false,
      characters: characters,
      cells: Array(25).fill().map((_, index) => index + 1),
      dice: "",
      events: events.map(event => event.cell),
      game: null,
    },
    methods: {
      fetchGameState() {
        axios.get('/api/gamestate/1/')  // 例としてID=1のゲームの状態を取得
          .then(response => {
            this.game = response.data;
            this.playerPosition = this.game.player_position;
            this.cpuPosition = this.game.cpu_position;
            this.isPlayerTurn = this.game.is_player_turn;
            this.isGameOver = this.game.is_game_over;
            this.dice = this.game.dice;
          });
      },
    
      updateGameState() {
        axios.put('/api/gamestate/1/', {
          player_position: this.playerPosition,
          cpu_position: this.cpuPosition,
          is_player_turn: this.isPlayerTurn,
          is_game_over: this.isGameOver,
          dice: this.dice
        });
      },
      rollDice() {
        const dice = Math.floor(Math.random() * 6) + 1;
        this.dice = dice;
        this.movePlayer(dice);
        this.isPlayerTurn = !this.isPlayerTurn;
        this.updateGameState(); 
      },
      cpuRollDice() {
        const dice = Math.floor(Math.random() * 6) + 1;
        this.dice = dice;
        this.moveCPU(dice);
        this.isPlayerTurn = !this.isPlayerTurn;
        this.updateGameState();
      },
      movePlayer(dice) {
        const newPosition = Math.min(this.playerPosition + dice, 25);
        const move = setInterval(() => {
          dice > 0 ? this.playerPosition += 1 : this.playerPosition -= 1;
          this.characters[0].position = this.playerPosition;
          if (this.playerPosition == newPosition) {
            setTimeout(() => {
              this.event(this.playerPosition);
            }, 500);
            clearInterval(move);
          }
  
          if (this.characters[0].position === 25) {
            this.isGameOver = true;
            setTimeout(() => {
              alert("プレイヤーの勝ち！！");
            }, 500);
          }
        }, 500);
      },
      moveCPU(dice) {
        const newPosition = Math.min(this.cpuPosition + dice, 25);
        const move = setInterval(() => {
          dice > 0 ? this.cpuPosition += 1 : this.cpuPosition -= 1;
          this.characters[1].position = this.cpuPosition;
          if (this.cpuPosition == newPosition) {
            setTimeout(() => {
              this.event(this.cpuPosition);
            }, 500);
            clearInterval(move);
          }
  
          if (this.characters[1].position === 25) {
            this.isGameOver = true;
            setTimeout(() => {
              alert("プレイヤーの負け！！");
            }, 500);
          }
        }, 500);
      },
      event(position) {
        for (const event of events) {
          if (position == event.cell) {
            alert(event.name);
            this.isPlayerTurn ? this.moveCPU(event.move) : this.movePlayer(event.move);
          }
        }
      },
      resetGameState() {
        axios.put('/api/gamestate/1/', {
          player_position: 1,
          cpu_position: 1,
          is_player_turn: true,
          is_game_over: false,
          dice: 0
        });
      }
    },
    mounted() {
      this.resetGameState();
      this.fetchGameState();
    },
  });