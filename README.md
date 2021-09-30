# TP2 Sistemas DIstribuidos con Apache Kafka
***
## Descargar Apache Kafka desde este [link](https://dlcdn.apache.org/kafka/2.8.0/kafka_2.13-2.8.0.tgz)
## Entrar en la carpeta descomprimida de kafka

**Para iniciar Kafka en Linux/Mac se deben ejecutar los siguentes comandos abriendo dos consolas:**
```
    bin/zookeeper-server-start.sh config/zookeeper.properties
```
```
    bin/kafka-server-start.sh config/server.properties
```

**Para iniciar Kafka en Windows se deben ejecutar los siguentes comandos abriendo dos consolas:**
* Dentro de la carpeta descomprimida de kafka entrar en **\bin\windows** y ejecutar los siguentes comandos
```
    .\zookeeper-server-start.bat ..\\..\config\zookeeper.properties
```
```
    .\kafka-server-start.bat ..\\..\config\server.properties
```

**Para ver los topics creados en Kafka en un puerto especifico ejecutar el siguente comando:**
```
    .\bin\windows\kafka-topics.bat --list --zookeeper localhost:2181
```