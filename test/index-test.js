import dora from 'dora';
import request from 'request';
import expect from 'expect';
import { join } from 'path';

describe('index', () => {
  const oldCwd = process.cwd();
  const cwdWithoutConfig = join(__dirname, './fixtures/app_without_config');
  const cwdWithConfig = join(__dirname, './fixtures/app_with_config');

  describe('publicPath-without-config', () => {
    const portWithoutConfig = 12347;

    before(done => {
      process.chdir(cwdWithoutConfig);
      dora({
        port: portWithoutConfig,
        plugins: [
          '../../../src/index?{"publicPath": "/foo/", "verbose":true}'
        ],
        cwd: cwdWithoutConfig,
        verbose: true,
      });
      setTimeout(done, 1000);
    });

    after(() => {
      process.chdir(oldCwd);
    });

    it('/foo/index.js', (done) => {
      request(`http://localhost:${portWithoutConfig}/foo/index.js`, (err, res, body) => {
        expect(res.statusCode).toEqual(200);
        expect(body.indexOf('webpackJsonp') > -1).toExist();
        done();
      });
    });

    it('/index.js', (done) => {
      request(`http://localhost:${portWithoutConfig}/index.js`, (err, res, body) => {
        expect(res.statusCode).toEqual(200);
        expect(body.indexOf('webpackJsonp') > -1).toNotExist();
        done();
      })
    });

  });

  describe('publicPath-with-config', () => {
    const portWithConfig = 12348;

    before(done => {
      process.chdir(cwdWithConfig);
      dora({
        port: portWithConfig,
        plugins: [
          '../../../src/index?{"verbose":true}'
        ],
        cwd: cwdWithConfig,
        verbose: true,
      });
      setTimeout(done, 1000);
    });

    after(() => {
      process.chdir(oldCwd);
    });

    it('/coo/index.js', (done) => {
      request(`http://localhost:${portWithConfig}/coo/index.js`, (err, res, body) => {
        expect(res.statusCode).toEqual(200);
        expect(body.indexOf('webpackJsonp') > -1).toExist();
        done();
      });
    });

    it('/index.js', (done) => {
      request(`http://localhost:${portWithConfig}/index.js`, (err, res, body) => {
        expect(res.statusCode).toEqual(200);
        expect(body.indexOf('webpackJsonp') > -1).toNotExist();
        done();
      })
    });

  });
});
