const board = document.querySelector(".board");

const result = document.querySelector("#result");
const selectedResult = document.querySelector("#selected-result");

const startButton = document.querySelector("#start-button");

const player1PiecesSelect =
    document.querySelector("#player1-pieces");

const player2PiecesSelect =
    document.querySelector("#player2-pieces");



const nextTurnButton =
    document.querySelector("#next-turn-button");

const turnDisplay =
    document.querySelector("#turn-display");

const missionOverlay =
    document.querySelector("#mission-overlay");

const missionText =
    document.querySelector("#mission-text");

const missionSuccessButton =
    document.querySelector("#mission-success");

const missionFailButton =
    document.querySelector("#mission-fail");

const routeOverlay =
    document.querySelector("#route-overlay");

const outerRouteButton =
    document.querySelector("#outer-route-button");

const diagonalRouteButton =
    document.querySelector("#diagonal-route-button");

const restartButton =
    document.getElementById("restart-button");

const winOverlay =
    document.getElementById("win-overlay");

const winTitle =
    document.getElementById("win-title");

const winMessage =
    document.getElementById("win-message");

const winRestartButton =
    document.getElementById("win-restart-button");


/* =========================
   게임 상태
========================= */

let pieces = [];

let currentTeam = 1;

let selectedYut = null;

let gameStarted = false;

let gameFinished = false;

let pendingMove = null;

let pendingRoutePiece = null;


/* =========================
   윷 결과
========================= */

const yutValues = {
    "빽도": -1,
    "도": 1,
    "개": 2,
    "걸": 3,
    "윷": 4,
    "모": 5
};


/* =========================
   바깥쪽 경로
========================= */

const outerRoute = [
    "p10",
    "p9",
    "p8",
    "p7",
    "p6",
    "p5",
    "p4",
    "p3",
    "p2",
    "p1",
    "p20",
    "p19",
    "p18",
    "p17",
    "p16",
    "p15",
    "p14",
    "p13",
    "p12",
    "p11"
];


/* =========================
   대각선 경로
========================= */

const diagonalRoute1 = [
    "p1",
    "d1",
    "d2",
    "center",
    "d3",
    "d4",
    "p11"
];

const diagonalRoute2 = [
    "p6",
    "d5",
    "d6",
    "center",
    "d7",
    "d8",
    "p16",
    "p15",
    "p14",
    "p13",
    "p12",
    "p11"
];


/* =========================
   미션
========================= */

const missions = {

    p10: "교회 여자 집사님 이름 3명 5초안에 말하기",
    p9: "옆에 있는 친구 3초 안에 안아주기",
    p8: "말씀찾기/찬송가 찾기",
    p7: "말씀찾기/찬송가 찾기",
    p6: "깜짝 퀴즈",
    p5: "말씀찾기/찬송가 찾기",
    p4: "선생님과 가위바위보 해서 이기기",
    p3: "말씀찾기/찬송가 찾기",
    p2: "말씀찾기/찬송가 찾기",
    p1: "깜짝 퀴즈",

    p20: "말씀찾기/찬송가 찾기",
    p19: "말씀찾기/찬송가 찾기",
    p18: "(대표 2명) 선정해서 일심동체 게임",
    p17: "말씀찾기/찬송가 찾기",
    p16: "깜짝 퀴즈",
    p15: "말씀찾기/찬송가 찾기",
    p14: "교회 장로님 이름 3명 5초 안에 말하기",
    p13: "말씀찾기/찬송가 찾기",
    p12: "말씀찾기/찬송가 찾기",
    p11: "깜짝 퀴즈",

    d1: "말씀찾기/찬송가 찾기",
    d2: "말씀찾기/찬송가 찾기",
    d3: "예수님 제자 5명 5초안에 말하기",
    d4: "말씀찾기/찬송가 찾기",

    d5: "성경인물 3명을 5초안에 말하기",
    d6: "말씀찾기/찬송가 찾기",
    d7: "말씀찾기/찬송가 찾기",
    d8: "교회 남자집사님 이름 3명 5초안에 말하기",

    center: "깜짝 퀴즈"
};

const timedMissionPoints = [
    "p8",
    "p7",
    "p5",
    "p3",
    "p2",
    "p20",
    "p19",
    "p17",
    "p15",
    "p13",
    "p12",
    "d1",
    "d2",
    "d4",
    "d6",
    "d7"
];

const timedMissionSeconds = 12;

let missionTimer = null;
let missionTimeLeft = 0;
/* =========================
   게임 시작
========================= */

startButton.addEventListener("click", startGame);

function startGame() {

    board.querySelectorAll(".game-piece")
        .forEach(piece => piece.remove());

    board.querySelectorAll(".team-title")
        .forEach(title => title.remove());

    pieces = [];

    currentTeam = 1;

    selectedYut = null;

    pendingMove = null;

    pendingRoutePiece = null;

    gameStarted = true;

    gameFinished = false;

    closeMission();

    closeRoute();

    selectedResult.textContent =
        "선택한 결과: 없음";

    result.textContent =
        "1팀부터 시작합니다. 실제 윷을 던진 후 결과를 선택해주세요.";

    turnDisplay.textContent =
        "현재 차례: 1팀";


    createTeamTitle(1);
    createTeamTitle(2);


    const count1 =
        Number(player1PiecesSelect.value);

    const count2 =
        Number(player2PiecesSelect.value);


    for (let i = 1; i <= count1; i++) {
        createPiece(1, i);
    }

    for (let i = 1; i <= count2; i++) {
        createPiece(2, i);
    }
}


/* =========================
   팀 이름
========================= */

function createTeamTitle(team) {

    const title = document.createElement("div");

    title.className = "team-title";

    title.textContent =
        team + "팀";

    title.style.left =
        "calc(50% + 420px)";

    title.style.top =
        team === 1 ? "120px" : "440px";

    board.appendChild(title);
}


/* =========================
   말 생성
========================= */

function createPiece(team, number) {

    const element =
        document.createElement("div");

    element.className =
        "game-piece player" + team;

    const koreanNumbers = [
    "방", "이", "교", "회", "방",
    "이", "사", "아", "자", "차"
];

element.textContent = koreanNumbers[number - 1];

    const piece = {

        element: element,

        team: team,

        number: number,

        /*
         * 시작 위치는 null
         */
        position: null,

        /*
         * 시작은 무조건 바깥쪽
         */
        route: "outer",

        stack: null,

        finished: false
    };


    element.addEventListener(
        "click",
        function () {

            if (!gameStarted || gameFinished) {
                return;
            }

            if (piece.team !== currentTeam) {

                result.textContent =
                    "현재는 " +
                    currentTeam +
                    "팀 차례입니다.";

                return;
            }

            if (pendingMove !== null) {

                result.textContent =
                    "먼저 미션을 완료해주세요.";

                return;
            }

            if (pendingRoutePiece !== null) {

                result.textContent =
                    "먼저 이동 경로를 선택해주세요.";

                return;
            }

            if (selectedYut === null) {

                result.textContent =
                    "먼저 윷 결과를 선택해주세요.";

                return;
            }

            movePiece(piece);
        }
    );


    pieces.push(piece);

    board.appendChild(element);

    moveToWaitingArea(piece);
}


/* =========================
   대기 공간
========================= */

function moveToWaitingArea(piece) {

    if (piece.finished) {

        piece.element.style.display =
            "none";

        return;
    }

    /*
     * 말이 보드 칸(.point) 안에 들어가 있으면
     * left/top의 기준점이 해당 칸으로 바뀝니다.
     * 따라서 대기 장소로 돌릴 때는 반드시
     * board로 다시 옮긴 뒤 위치를 지정합니다.
     */
    board.appendChild(piece.element);

    piece.element.style.display =
        "flex";


    let top;


    if (piece.team === 1) {

        top =
            180 +
            ((piece.number - 1) * 65);

    } else {

        top =
            500 +
            ((piece.number - 1) * 65);
    }


    piece.element.style.left =
        "calc(50% + 420px)";

    piece.element.style.top =
        top + "px";

    piece.element.style.zIndex =
        "10";
}


/* =========================
   윷 결과 선택
========================= */

document.querySelectorAll(
    ".result-buttons button"
).forEach(button => {

    button.addEventListener(
        "click",
        function () {

            if (!gameStarted || gameFinished) {
                return;
            }

            if (pendingMove !== null) {

                result.textContent =
                    "먼저 미션을 완료해주세요.";

                return;
            }

            if (pendingRoutePiece !== null) {

                result.textContent =
                    "먼저 이동 경로를 선택해주세요.";

                return;
            }


            selectedYut =
                this.dataset.yut;


            selectedResult.textContent =
                "선택한 결과: " +
                selectedYut;


            result.textContent =
                currentTeam +
                "팀이 " +
                selectedYut +
                "을 선택했습니다. " +
                "이동할 말을 선택해주세요.";
        }
    );
});


/* =========================
   말 이동 시작
========================= */

function movePiece(piece) {

    if (piece.finished) {
        return;
    }

    const value =
        yutValues[selectedYut];


    /*
     * 아직 출발하지 않은 말
     * 도(1칸) → p10
     */
    if (piece.position === null) {

        executeMove(
            piece,
            value,
            "outer"
        );

        return;
    }


    /*
     * 빽도
     * 현재 말이 들어와 있는 경로를
     * 그대로 역방향으로 이동
     */
    if (value < 0) {

        executeMove(
            piece,
            value,
            piece.route
        );

        return;
    }


    /*
     * 앞으로 이동할 때
     * 경로 선택이 필요한 모서리
     */
    if (
        value > 0 &&
        isRouteChoiceCorner(piece)
    ) {

        pendingRoutePiece =
            piece;

        openRouteChoice(piece);

        return;
    }


    /*
     * 일반 이동
     */
    executeMove(
        piece,
        value,
        piece.route
    );
}


/* =========================
   경로 선택 위치 확인
========================= */

function isRouteChoiceCorner(piece) {

    /*
     * 시작 위치는 제외
     */

    if (piece.position === null) {
        return false;
    }


    return (
        piece.position === "p1" ||
        piece.position === "p6" ||
        piece.position === "center"
    );
}

/* =========================
   경로 선택 창
========================= */

/* =========================
   경로 선택 창
========================= */

function openRouteChoice(piece) {

    routeOverlay.style.display =
        "flex";


    outerRouteButton.style.display =
        "inline-block";

    diagonalRouteButton.style.display =
        "inline-block";


    /*
     * 중앙
     */

    if (piece.position === "center") {

        outerRouteButton.textContent =
            "왼쪽 아래";

        diagonalRouteButton.textContent =
            "오른쪽 아래";

        return;
    }


    /*
     * p1
     */

    if (piece.position === "p1") {

        outerRouteButton.textContent =
            "바깥쪽 길";

        diagonalRouteButton.textContent =
            "대각선 길";

        return;
    }


    /*
     * p6
     */

    if (piece.position === "p6") {

        outerRouteButton.textContent =
            "바깥쪽 길";

        diagonalRouteButton.textContent =
            "대각선 길";

        return;
    }
}


/* =========================
   바깥쪽 경로 선택
========================= */

/* =========================
   바깥쪽 / 왼쪽 아래 경로 선택
========================= */

outerRouteButton.addEventListener(
    "click",
    function () {

        if (!pendingRoutePiece) {
            return;
        }


        const piece =
            pendingRoutePiece;


        const value =
            yutValues[selectedYut];


        /*
         * 중앙 → 왼쪽 아래
         */

        if (piece.position === "center") {

            piece.route =
                "diagonal2";

            pendingRoutePiece = null;

            closeRoute();


            executeMove(
                piece,
                value,
                "diagonal2"
            );

            return;
        }


        /*
         * p1 / p6 → 바깥쪽 길
         */

        piece.route =
            "outer";


        pendingRoutePiece = null;


        closeRoute();


        executeMove(
            piece,
            value,
            "outer"
        );
    }
);


/* =========================
   대각선 경로 선택
========================= */

diagonalRouteButton.addEventListener(
    "click",
    function () {

        if (!pendingRoutePiece) {
            return;
        }


        const piece =
            pendingRoutePiece;


        const value =
            yutValues[selectedYut];


        let route;


        /*
         * p1 → 대각선 1
         */

        if (piece.position === "p1") {

            route =
                diagonalRoute1;
        }


        /*
         * p6 → 대각선 2
         */

        else if (piece.position === "p6") {

            route =
                diagonalRoute2;
        }


        /*
         * 중앙 → 오른쪽 아래
         * 대각선 1
         */

        else if (piece.position === "center") {

            route =
                diagonalRoute1;
        }


        /*
         * 그 외에는 실행하지 않음
         */

        else if (piece.position === "p16") {
    route = diagonalRoute2;
}

else if (piece.position === "center") {
    route = diagonalRoute1;
}

else {
    return;
}


        piece.route =
            route === diagonalRoute1
                ? "diagonal1"
                : "diagonal2";


        pendingRoutePiece = null;


        closeRoute();


        executeMove(
            piece,
            value,
            piece.route
        );
    }
);


/* =========================
   실제 이동
========================= */

function executeMove(
    piece,
    value,
    routeType
) {

    const movingPieces =
        getStack(piece);

    const mainPiece =
        movingPieces[0];

    const previousPosition =
        mainPiece.position;

    const previousRoute =
        mainPiece.route;


    /*
     * 시작 위치
     * 첫 이동은 바깥쪽 경로의 p10으로 이동
     */
    if (previousPosition === null) {

        if (value < 0) {

            result.textContent =
                "시작 위치에서는 빽도로 이동할 수 없습니다.";

            return;
        }

        const targetIndex =
            value - 1;

        if (
            targetIndex < 0 ||
            targetIndex >= outerRoute.length
        ) {

            result.textContent =
                "이동할 수 없는 위치입니다.";

            return;
        }

        moveToPoint(
            movingPieces,
            outerRoute[targetIndex],
            previousPosition,
            previousRoute
        );

        return;
    }


    /*
     * p11에서 빽도
     * p11 → p10
     */
    if (
        value < 0 &&
        mainPiece.position === "p11"
    ) {

        movingPieces.forEach(
            movingPiece => {
                movingPiece.route = "outer";
            }
        );

        moveToPoint(
            movingPieces,
            "p10",
            previousPosition,
            previousRoute
        );

        return;
    }


    /*
     * 현재 말이 있는 경로
     */
    const route =
        getRoute(
            mainPiece,
            routeType
        );


    const currentIndex =
        getRouteIndex(
            mainPiece,
            route
        );


    /*
     * 현재 위치를 기준으로
     * 결과만큼 이동
     */
    const targetIndex =
        currentIndex + value;


    /* =========================
   빽도
========================= */

if (value < 0) {
    // p10에서는 특수 규칙으로 p11로 이동
    if (mainPiece.position === "p10") {
        moveToPoint(
            movingPieces,
            "p11",
            previousPosition,
            previousRoute
        );
        return;
    }

    // p11에서는 빽도 사용 불가
    if (mainPiece.position === "p11") {
        result.textContent = "p11에서는 빽도를 사용할 수 없습니다.";
        return;
    }

    // 현재 위치에서 왔던 방향으로 한 칸 뒤로 이동
    const backIndex = currentIndex - 1;

    if (backIndex < 0) {
        result.textContent = "더 이상 뒤로 갈 수 없습니다.";
        return;
    }

    const backPoint = route[backIndex];

    moveToPoint(
        movingPieces,
        backPoint,
        previousPosition,
        previousRoute
    );
    return;
}


    /*
     * p11을 지나가면 완주
     */
    const finishIndex =
        route.indexOf("p11");

    if (
        value > 0 &&
        finishIndex !== -1 &&
        targetIndex > finishIndex
    ) {

        finishPiece(
            movingPieces
        );

        return;
    }


    /*
     * p11에 정확히 도착
     */
    if (
        value > 0 &&
        route[targetIndex] === "p11"
    ) {

        moveToPoint(
            movingPieces,
            "p11",
            previousPosition,
            previousRoute
        );

        return;
    }


    /*
     * 경로 밖으로 이동
     */
    if (
        targetIndex < 0 ||
        targetIndex >= route.length
    ) {

        result.textContent =
            "이동할 수 없는 위치입니다.";

        return;
    }


    /*
     * 실제 이동할 칸
     */
    const targetPoint =
        route[targetIndex];


    moveToPoint(
        movingPieces,
        targetPoint,
        previousPosition,
        previousRoute
    );
}


/* =========================
   경로 반환
========================= */

function getRoute(piece, routeType) {

    if (routeType === "diagonal1") {
        return diagonalRoute1;
    }

    if (routeType === "diagonal2") {
        return diagonalRoute2;
    }


    return outerRoute;
}


/* =========================
   현재 경로에서 위치 찾기
========================= */

function getRouteIndex(piece, route) {

    if (piece.position === null) {
        return -1;
    }


    return route.indexOf(
        piece.position
    );
}


/* =========================
   특정 칸으로 이동
========================= */

function moveToPoint(
    movingPieces,
    targetPoint,
    previousPosition,
    previousRoute
) {

    const targetPosition =
        targetPoint;


    /*
     * 같은 팀 말
     */

    const sameTeamPieces =
        pieces.filter(other => {

            return (
                !other.finished &&
                other.team === movingPieces[0].team &&
                !movingPieces.includes(other) &&
                other.position === targetPosition
            );
        });


    /*
     * 상대 팀 말
     */

    const enemyPieces =
        pieces.filter(other => {

            return (
                !other.finished &&
                other.team !== movingPieces[0].team &&
                other.position === targetPosition
            );
        });


    /*
     * 새 스택
     */

    const newStack = [
        ...movingPieces,
        ...sameTeamPieces
    ];


    /*
     * 위치 변경
     */

    newStack.forEach(piece => {

        piece.position =
            targetPosition;

        piece.route =
            movingPieces[0].route;

        piece.stack =
            newStack;

        piece.finished =
            false;
    });


    placeStackOnPoint(
        newStack,
        targetPoint
    );


    /*
     * 이동 상태 저장
     */

    pendingMove = {

        movingPieces:
            movingPieces,

        sameTeamPieces:
            sameTeamPieces,

        enemyPieces:
            enemyPieces,

        previousPosition:
            previousPosition,

        previousRoute:
            previousRoute,

        newPosition:
            targetPosition,

        newStack:
            newStack,

        targetPoint:
            targetPoint
    };


    selectedYut = null;

    selectedResult.textContent =
        "선택한 결과: 없음";


    showMission(
        targetPoint
    );
}


/* =========================
   스택 표시
========================= */

function placeStackOnPoint(
    stack,
    pointName
) {

    const point =
        document.querySelector(
            "." + pointName
        );


    if (!point) {
        return;
    }


    stack.forEach(
        (piece, index) => {

            piece.element.style.display =
                "flex";

            piece.element.style.left =
                "50%";

            piece.element.style.top =
                "50%";

            piece.element.style.zIndex =
                20 + index;


            point.appendChild(
                piece.element
            );
        }
    );


    stack.forEach(piece => {

        piece.stack =
            stack;

        piece.position =
            pointName;
    });
}


/* =========================
   미션
========================= */

function showMission(pointName) {

    if (missionTimer !== null) {
        clearInterval(missionTimer);
        missionTimer = null;
    }

    if (timedMissionPoints.includes(pointName)) {

        missionTimeLeft = timedMissionSeconds;

        missionText.innerHTML =
            missions[pointName] +
            "<br><br>" +
            "남은 시간: " +
            "<br>" +
            "<span id=\"mission-timer\">10.00</span>초";

        missionOverlay.style.display =
            "flex";

        const startTime = performance.now();

        missionTimer = setInterval(
            function () {

                const elapsed =
                    (performance.now() - startTime) / 1000;

                const remaining =
                    Math.max(
                        0,
                        timedMissionSeconds - elapsed
                    );

                const timerElement =
                    document.getElementById(
                        "mission-timer"
                    );

                if (timerElement) {
                    timerElement.textContent =
                        remaining.toFixed(2);
                }

                if (remaining <= 0) {

                    clearInterval(missionTimer);
                    missionTimer = null;

                    missionFailButton.click();
                }

            },
            10
        );

    } else {

        missionText.textContent =
            missions[pointName] ||
            "미션을 수행해주세요.";

        missionOverlay.style.display =
            "flex";
    }
}


/* =========================
   미션 성공
========================= */

missionSuccessButton.addEventListener(
    "click",
    function () {

        if (!pendingMove) {
            return;
        }


        const move =
            pendingMove;


        /*
         * 상대 말 잡기
         */

        const uniqueEnemies =
            [...new Set(
                move.enemyPieces
            )];


        uniqueEnemies.forEach(
            enemy => {

                enemy.position =
                    null;

                enemy.stack =
                    null;

                enemy.route =
                    "outer";

                moveToWaitingArea(
                    enemy
                );
            }
        );


        /*
         * 새 스택 유지
         */

        move.newStack.forEach(
            piece => {

                piece.stack =
                    move.newStack;
            }
        );


        if (
            uniqueEnemies.length > 0
        ) {

            result.textContent =
                currentTeam +
                "팀이 미션에 성공하여 상대 말을 잡았습니다.";

        } else {

            result.textContent =
                currentTeam +
                "팀이 미션에 성공했습니다.";
        }


        pendingMove = null;

        closeMission();


        checkWin();
    }
);


/* =========================
   미션 실패
========================= */

missionFailButton.addEventListener(
    "click",
    function () {

        if (!pendingMove) {
            return;
        }


        const move =
            pendingMove;


        /*
         * 새로 업힌 같은 팀 말은
         * 원래 대기 장소로 복귀
         */

        move.sameTeamPieces.forEach(
            piece => {

                piece.position =
                    null;

                piece.stack =
                    null;

                piece.route =
                    "outer";

                moveToWaitingArea(
                    piece
                );
            }
        );


        /*
         * 움직였던 스택 복구
         */

        if (
            move.previousPosition === null
        ) {

            move.movingPieces.forEach(
                piece => {

                    piece.position =
                        null;

                    piece.route =
                        move.previousRoute;

                    piece.stack =
                        move.movingPieces;

                    moveToWaitingArea(
                        piece
                    );
                }
            );

        } else {

            move.movingPieces.forEach(
                piece => {

                    piece.position =
                        move.previousPosition;

                    piece.route =
                        move.previousRoute;

                    piece.stack =
                        move.movingPieces;
                }
            );


            placeStackOnPoint(
                move.movingPieces,
                move.previousPosition
            );
        }


        result.textContent =
            currentTeam +
            "팀이 미션에 실패하여 이동 전 위치로 돌아갑니다.";


        pendingMove = null;

        closeMission();
    }
);


/* =========================
   미션 닫기
========================= */

function closeMission() {

    if (missionTimer !== null) {
        clearInterval(missionTimer);
        missionTimer = null;
    }

    missionTimeLeft = 0;

    missionOverlay.style.display =
        "none";
}


/* =========================
   경로 창 닫기
========================= */

function closeRoute() {

    routeOverlay.style.display =
        "none";
}


/* =========================
   스택 가져오기
========================= */

function getStack(piece) {

    if (
        piece.stack &&
        piece.stack.length > 0
    ) {

        return [...piece.stack];
    }


    return [piece];
}


/* =========================
   완주
========================= */

function finishPiece(
    movingPieces
) {

    movingPieces.forEach(
        piece => {

            piece.finished =
                true;

            piece.position =
                "finished";

            piece.stack =
                null;

            piece.element.style.display =
                "none";
        }
    );


    pendingMove = null;

    selectedYut = null;

    selectedResult.textContent =
        "선택한 결과: 없음";


    closeMission();


    result.textContent =
        currentTeam +
        "팀의 말 " +
        movingPieces.length +
        "개가 완주했습니다.";


    checkWin();
}


/* =========================
   승리 확인
========================= */

function checkWin() {

    for (let team = 1; team <= 2; team++) {

        const teamPieces = pieces.filter(
            piece => piece.team === team
        );

        if (teamPieces.length === 0) {
            continue;
        }

        const allFinished = teamPieces.every(
            piece => piece.finished === true
        );

        if (!allFinished) {
            continue;
        }

        gameFinished = true;

        // 기존 승리창이 있으면 표시
        if (winOverlay) {

            winTitle.textContent =
                team + "팀 승리!";

            winMessage.textContent =
                "모든 말을 완주했습니다.";

            winOverlay.style.display = "flex";

        } else {

            // 승리창이 없으면 새로 생성
            const overlay =
                document.createElement("div");

            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.background =
                "rgba(0, 0, 0, 0.5)";
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.zIndex = "9999";

            const box =
                document.createElement("div");

            box.style.width = "400px";
            box.style.padding = "35px";
            box.style.background = "#fff7e8";
            box.style.border = "4px solid #6b3f1f";
            box.style.borderRadius = "15px";
            box.style.textAlign = "center";
            box.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.3)";

            const title =
                document.createElement("h2");

            title.textContent =
                team + "팀 승리!";

            title.style.margin =
                "0 0 15px";

            title.style.fontSize =
                "32px";

            title.style.color =
                "#4a2a16";

            const message =
                document.createElement("p");

            message.textContent =
                "모든 말을 완주했습니다.";

            message.style.margin =
                "0 0 25px";

            message.style.fontSize =
                "18px";

            message.style.fontWeight =
                "bold";

            message.style.color =
                "#4a2a16";

            const restart =
                document.createElement("button");

            restart.textContent =
                "게임 재시작";

            restart.style.width =
                "150px";

            restart.style.height =
                "50px";

            restart.style.border =
                "2px solid #6b3f1f";

            restart.style.borderRadius =
                "8px";

            restart.style.background =
                "#6b3f1f";

            restart.style.color =
                "white";

            restart.style.fontSize =
                "17px";

            restart.style.fontWeight =
                "bold";

            restart.style.cursor =
                "pointer";

            restart.addEventListener(
                "click",
                function () {
                    location.reload();
                }
            );

            box.appendChild(title);
            box.appendChild(message);
            box.appendChild(restart);

            overlay.appendChild(box);

            document.body.appendChild(overlay);
        }

        result.textContent =
            team + "팀 승리!";

        turnDisplay.textContent =
            "게임 종료";

        return;
    }
}



/* =========================
   차례 넘기기
========================= */

nextTurnButton.addEventListener(
    "click",
    function () {

        if (!gameStarted || gameFinished) {
            return;
        }


        if (pendingMove !== null) {

            result.textContent =
                "먼저 미션을 완료해주세요.";

            return;
        }


        if (pendingRoutePiece !== null) {

            result.textContent =
                "먼저 이동 경로를 선택해주세요.";

            return;
        }


        currentTeam =
            currentTeam === 1
                ? 2
                : 1;


        selectedYut = null;


        selectedResult.textContent =
            "선택한 결과: 없음";


        turnDisplay.textContent =
            "현재 차례: " +
            currentTeam +
            "팀";


        result.textContent =
            currentTeam +
            "팀 차례입니다. 실제 윷을 던진 후 결과를 선택해주세요.";
    }
);

/* =========================
   게임 재시작
========================= */

function restartGame() {

    location.reload();
}


restartButton.addEventListener(
    "click",
    function () {

        if (
            confirm("게임을 다시 시작하시겠습니까?")
        ) {
            restartGame();
        }

    }
);


