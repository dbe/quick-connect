const service = {
  echo,
  getOpenGames,
}

function echo(args, callback) {
  console.log(`args: ${args}`);
  console.log(args);
  callback(null, args);
}

function getOpenGames(args, callback) {
  callback(null, ['sdf3523h1h1lk3###', 'lkasdjfkl1188383838']);
}

export default service;
