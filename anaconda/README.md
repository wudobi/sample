# anaconda commands interface

## 가상환경 설정관련
```bash
conda create -n 가상환경 이름 # 가상환경 생성
conda remove -n 가항환경 이름 --a # 가상환경 삭제
conda info --envs # 가상환경 목록
activate [가상환경 이름] # 해당 가상환경을 활성화
deactivate # 현재 가상환경을 비활성화
```

## 패키지 관리
```bash
conda install 패키지명 # 패키지를 설치
conda list # 가상환경 내 설치 패키지 확인
```