{ pkgs ? import <nixpkgs> { } }:
# 24.05
pkgs.mkShell {
  packages = with pkgs; [
    nodejs_20
    pnpm
  ];
}
