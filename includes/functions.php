<?php function isLoginSessionExpired() {
  $login_session_duration = 604800;
  $current_time = time();
  if(isset($_SESSION['loggedin_time']) and isset($_SESSION['Mem_ID'])){
    //   echo "<br>";
    // echo "time func ".time();
    //   echo "<br>";
    // echo "time sess func ".$_SESSION['loggedin_time'];
    // echo "<br>";
    // echo "fss=".$login_session_duration;
    // echo "<br>";
    // echo (time() - $_SESSION['loggedin_time']);
    if(((time() - $_SESSION['loggedin_time']) > $login_session_duration)){
      return true;
    }
  }
  return false;
} ?>
