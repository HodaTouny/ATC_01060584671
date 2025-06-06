const authService = require('../services/authService');
const i18n = require('../config/i18n');
const { accessTokenOptions, refreshTokenOptions } = require('../config/secureCookies');

class AuthController {
  constructor() {
    this.setLocale = this.setLocale.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
  }
  setLocale(req) {
    const lang = req.headers['accept-language'] || 'en';
    i18n.setLocale(lang);
    return lang;
  }

  async register(req, res) {
    const lang = this.setLocale(req);
    try {
      const user = await authService.register(req.body, lang);
      res.status(201).json({
        message: i18n.__('User registered successfully'),
        user
      });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async login(req, res) {
    const lang = this.setLocale(req);
    try {
      const { accessToken, refreshToken ,user} = await authService.login(req.body, lang);
      res.cookie('access_token', accessToken, accessTokenOptions);
      res.cookie('refresh_token', refreshToken, refreshTokenOptions);
      res.status(200).json({ message: i18n.__('Login successful'), accessToken, refreshToken,user });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async refreshToken(req, res) {
    const lang = this.setLocale(req);
    try {
      const token = req.cookies.refresh_token;
      if(!token) {
        return res.status(401).json({ message: i18n.__('Unauthorized: No token provided') });
      }
      const newAccessToken = await authService.refreshToken(token, lang);
      res.cookie('access_token', newAccessToken, accessTokenOptions);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(error.status || 403).json({ message: error.message });
    }
  }

  async logout(req, res) {
    const lang = this.setLocale(req);
    res.clearCookie('access_token', {
    ...accessTokenOptions,
    maxAge: 0,
  });

  res.clearCookie('refresh_token', {
    ...refreshTokenOptions,
    maxAge: 0,
  });
    res.status(200).json({ message: i18n.__('Logged out successfully') });
  }

 async getCurrentUser(req, res) {
  try {
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

}

module.exports = new AuthController();
