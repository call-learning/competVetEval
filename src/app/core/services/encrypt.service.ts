import { EnvironmentService } from './environment.service'
import { Injectable } from '@angular/core'

import { SimpleCrypto } from 'simple-crypto-js'

@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  simpleCrypto: SimpleCrypto

  constructor(private environmentService: EnvironmentService) {
    this.simpleCrypto = new SimpleCrypto(this.environmentService.encryptSalt)
  }

  encrypt(plainText) {
    return this.simpleCrypto.encrypt(plainText)
  }

  decrypt(cryptedText) {
    return this.simpleCrypto.decrypt(cryptedText)
  }
}
