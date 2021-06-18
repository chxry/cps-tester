<script lang="ts">
  enum TestState {
    Testing,
    Idle,
    Cooldown,
  }

  let test = TestState.Idle;
  let clicks = 0;
  let testTime = 5;
  let history = [];

  const round = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

  const handleClick = (e: MouseEvent) => {
    createRipple(e);
    if (test == TestState.Idle) {
      test = TestState.Testing;
      setTimeout(() => {
        history = [round(clicks / testTime), ...history];
        test = TestState.Cooldown;
        setTimeout(() => {
          test = TestState.Idle;
          clicks = 0;
        }, 1500);
      }, testTime * 1000);
    }
    clicks++;
  };

  const createRipple = (e: MouseEvent) => {
    let target = <HTMLElement>e.target;
    let circle = document.createElement("div");
    target.appendChild(circle);

    let d = Math.max(target.clientWidth, target.clientHeight);
    circle.style.width = circle.style.height = d + "px";
    circle.style.left = e.clientX - target.offsetLeft - d / 2 + "px";
    circle.style.top = e.clientY - target.offsetTop - d / 2 + "px";

    circle.classList.add("ripple");
    circle.addEventListener("animationend", () => target.removeChild(circle));
  };
</script>

<main>
  <h1>CPS Tester</h1>
  <button
    on:click={(e) => handleClick(e)}
    disabled={test == TestState.Cooldown}
  >
    {#if test == TestState.Idle || test == TestState.Testing}
      <h2 class={test == TestState.Testing ? "fade" : ""}>
        CLICK TO START THE TEST
      </h2>
    {:else if test == TestState.Cooldown}
      <h2>YOUR CPS: {round(clicks / testTime)}</h2>
    {/if}
  </button>
  <div class="history">
    <h2>History:</h2>
    {#each history as record}
      <p>{record}</p>
    {/each}
  </div>
</main>
