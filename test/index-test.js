import dora from 'dora';
import request from 'request';
import expect from 'expect';
import { join } from 'path';

describe('index', () => {

  const port = 12347;
  const oldCwd = process.cwd();
  const cwd = join(__dirname, './fixtures/app');

  describe('publicPath', () => {

    before(done => {
      process.chdir(cwd);
      dora({
        port,
        plugins: [
          '../../../src/index?publicPath=/foo/&verbose'
        ],
        cwd: cwd,
        verbose: true,
      });
      setTimeout(done, 1000);
    });

    after(() => {
      process.chdir(oldCwd);
    });

    it('/foo/index.js', (done) => {
      request(`http://localhost:${port}/foo/index.js`, (err, res, body) => {
        expect(res.statusCode).toEqual(200);
        expect(body.indexOf('webpackJsonp') > -1).toExist();
        done();
      });
    });

    it('/index.js', (done) => {
      request(`http://localhost:${port}/index.js`, (err, res, body) => {
        expect(res.statusCode).toEqual(200);
        expect(body.indexOf('webpackJsonp') > -1).toNotExist();
        done();
      })
    });

  });
});
