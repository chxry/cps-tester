<script lang="ts">
  import themes from "./themes.json";

  enum TestState {
    Testing,
    Idle,
    Cooldown,
  }

  
    

  let test = TestState.Idle;
  let clicks = 0;
  let testTime = 5;

  const round = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;

  const handleClick = (e: MouseEvent) => {
    createRipple(e);
    if (test == TestState.Idle) {
      test = TestState.Testing;
      setTimeout(() => {
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

  const setTheme = (theme: string) => {
    Object.entries(themes[theme]).forEach(([key, colour]) =>
      document.documentElement.style.setProperty(`--${key}`, `#${colour}`)
    );
  };

  setTheme("norddark");
</script>

<main>
  <h1>CPS Tester</h1>
  <button
    class="clicker"
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
  <div class="bottom">
    <h2>Theme:</h2>
    <div class="themes">
      {#each Object.entries(themes) as [theme, colours]}
        <button
          on:click={() => setTheme(theme)}
          style={`background: linear-gradient( -45deg, #${colours.fg} 50%, #${colours.bg} 50% )`}
        />
      {/each}
    </div>
  </div>
</main>
